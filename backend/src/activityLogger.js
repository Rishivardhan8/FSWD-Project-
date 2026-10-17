import { query } from "./db.js";

export async function logUserActivity({
  userId = null,
  userName = "Unknown",
  email,
  activity,
  ipAddress = null,
  sessionId = null,
}) {
  try {
    if (!email || !activity) {
      console.error("Email and activity are required for activity logging.");
      return;
    }

    await query(
      `
      INSERT INTO public.user_activity_logs (
        user_id,
        user_name,
        email,
        activity,
        ip_address,
        session_id,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `,
      [
        userId,
        userName,
        email,
        activity,
        ipAddress,
        sessionId,
      ]
    );

    console.log(`Activity recorded: ${activity} - ${email}`);
  } catch (error) {
    console.error("Failed to record user activity:", error.message);
  }
}