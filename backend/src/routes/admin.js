import express from "express";
import { query } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Check whether the authenticated user is an administrator
async function requireAdmin(req, res, next) {
  try {
    const result = await query(
      `SELECT role, is_active
       FROM public.users
       WHERE id = $1`,
      [req.user.id]
    );

    const user = result.rows[0];

    if (!user || user.is_active === false) {
      return res.status(403).json({
        message: "Account not found or disabled.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Administrator access required.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

// Get registered users
router.get("/users", authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT
         id,
         name,
         email,
         role,
         is_active,
         last_login,
         last_seen
       FROM public.users
       ORDER BY id DESC`
    );

    res.json({
      users: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

// Get user activity logs
router.get(
  "/activity",
  authMiddleware,
  requireAdmin,
  async (req, res, next) => {
    try {
      const result = await query(
        `SELECT
           id,
           user_id,
           user_name,
           email,
           activity,
           ip_address,
           session_id,
           created_at
         FROM public.user_activity_logs
         ORDER BY created_at DESC
         LIMIT 200`
      );

      res.json({
        activities: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }
);
// Remove a registered user
router.delete(
  "/users/:id",
  authMiddleware,
  requireAdmin,
  async (req, res, next) => {
    try {
      const userId = Number(req.params.id);

      // Validate the requested user ID
      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({
          message: "Invalid user ID.",
        });
      }

      // Prevent administrators from deleting their own account
      if (String(req.user.id) === String(userId)) {
        return res.status(400).json({
          message: "You cannot remove your own administrator account.",
        });
      }

      // Check whether the target user exists
      const userResult = await query(
        `SELECT id, name, email, role
         FROM public.users
         WHERE id = $1`,
        [userId]
      );

      const targetUser = userResult.rows[0];

      if (!targetUser) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      // Prevent deleting another administrator
      if (targetUser.role === "admin") {
        return res.status(403).json({
          message: "Administrator accounts cannot be removed through this feature.",
        });
      }

      // Remove the user
      const deleteResult = await query(
        `DELETE FROM public.users
         WHERE id = $1
         RETURNING id, name, email`,
        [userId]
      );

      return res.json({
        message: "User removed successfully.",
        user: deleteResult.rows[0],
      });
    } catch (error) {
      next(error);
    }
  }
);
export default router;