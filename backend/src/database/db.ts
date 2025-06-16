import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Create a connection pool
export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  // If DATABASE_URL is not set, use individual parameters
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
  database: process.env.POSTGRES_DB || "trackship",
});
