import express from "express";
import { logUserActivity } from "../activityLogger.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { config } from "../config.js";
import { query } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Temporary users when PostgreSQL is disabled
const memoryUsers = [];

// ===============================
// CREATE JWT TOKEN
// ===============================

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || "user",
    },
    config.jwtSecret,
    {
      expiresIn: "2h",
    }
  );
}

// ===============================
// FORMAT USER RESPONSE
// ===============================

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || "user",
    isActive: user.is_active ?? true,
  };
}

// ===============================
// REGISTER USER
// ===============================

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      password.length < 6
    ) {
      return res.status(400).json({
        message:
          "Name, valid email and password of 6+ characters are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const passwordHash = await bcrypt.hash(password, 10);

    let user;

    // PostgreSQL registration
    if (config.useDatabase) {
      const result = await query(
        `
        INSERT INTO users (
          name,
          email,
          password_hash,
          role,
          is_active
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          id,
          name,
          email,
          role,
          is_active
        `,
        [
          name,
          normalizedEmail,
          passwordHash,
          "user",
          true,
        ]
      );

      user = result.rows[0];
    } else {
      // Temporary registration without database
      const existingUser = memoryUsers.find(
        (item) => item.email === normalizedEmail
      );

      if (existingUser) {
        return res.status(409).json({
          message: "Email is already registered.",
        });
      }

      user = {
        id: memoryUsers.length + 1,
        name,
        email: normalizedEmail,
        passwordHash,
        role: "user",
        is_active: true,
      };

      memoryUsers.push(user);
    }

    return res.status(201).json({
      token: createToken(user),
      user: formatUser(user),
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Email is already registered.",
      });
    }

    next(error);
  }
});

// ===============================
// LOGIN USER
// ===============================

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let user;

    // PostgreSQL login
    if (config.useDatabase) {
      const result = await query(
        `
        SELECT
          id,
          name,
          email,
          password_hash,
          role,
          is_active
        FROM users
        WHERE email = $1
        `,
        [normalizedEmail]
      );

      user = result.rows[0];
    } else {
      // Temporary login without database
      user = memoryUsers.find(
        (item) => item.email === normalizedEmail
      );
    }

    // Check user exists
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Check account status
    if (user.is_active === false) {
      return res.status(403).json({
        message: "Your account has been disabled.",
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(
      password,
      user.password_hash ?? user.passwordHash
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Update last login time
    if (config.useDatabase) {
      await query(
        `
        UPDATE users
        SET
          last_login = NOW(),
          last_seen = NOW()
        WHERE id = $1
        `,
        [user.id]
      );
    }

    // Successful login
    // Record successful login
await logUserActivity({
  userId: user.id,
  userName: user.name,
  email: user.email,
  activity: "LOGIN",
  ipAddress: req.ip,
  sessionId: req.get("user-agent")?.slice(0, 100) || null,
});

// Return login response
return res.json({
  token: createToken(user),
  user: formatUser(user),
});
  } catch (error) {
    next(error);
  }
});

// ===============================
// GET CURRENT LOGGED-IN USER
// ===============================

router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    if (config.useDatabase) {
      const result = await query(
        `
        SELECT
          id,
          name,
          email,
          role,
          is_active
        FROM users
        WHERE id = $1
        `,
        [req.user.id]
      );

      const user = result.rows[0];

      if (!user || user.is_active === false) {
        return res.status(401).json({
          message: "User not found or account disabled.",
        });
      }

      return res.json({
        user: formatUser(user),
      });
    }

    const user = memoryUsers.find(
      (item) => item.id === req.user.id
    );

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    return res.json({
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
});

// LOGOUT USER
router.post("/logout", authMiddleware, async (req, res, next) => {
  try {
    await logUserActivity({
      userId: req.user.id,
      userName: req.user.name || "Unknown",
      email: req.user.email,
      activity: "LOGOUT",
      ipAddress: req.ip,
      sessionId: req.get("user-agent")?.slice(0, 100) || null,
    });

    return res.json({
      message: "Logout recorded successfully.",
    });
  } catch (error) {
    next(error);
  }
});
export default router;