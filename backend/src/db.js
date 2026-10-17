import pg from "pg";
import { config } from "./config.js";

const { Pool } = pg;

export const pool = config.useDatabase
  ? new Pool({
      connectionString: config.databaseUrl,
      max: 10,
      idleTimeoutMillis: 30000,
    })
  : null;

export async function query(text, params = []) {
  if (!pool) {
    throw new Error("Database is disabled. Set USE_DATABASE=true.");
  }

  return pool.query(text, params);
}

export async function testDatabase() {
  if (!pool) return false;
  await pool.query("SELECT 1");
  return true;
}
