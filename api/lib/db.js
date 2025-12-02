// Database connection for Vercel serverless functions
import mysql from "mysql2/promise";

let connection;

export async function getConnection() {
  if (!connection) {
    // Use Railway MySQL (free tier) or other cloud database
    const config = {
      host: process.env.DB_HOST || process.env.DATABASE_HOST || "localhost",
      user: process.env.DB_USER || process.env.DATABASE_USER || "root",
      password: process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || "",
      database:
        process.env.DB_NAME || process.env.DATABASE_NAME || "ticketing_system",
      port: parseInt(
        process.env.DB_PORT || process.env.DATABASE_PORT || "3306"
      ),
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
      connectTimeout: 60000,
      acquireTimeout: 60000,
      timeout: 60000,
    };

    connection = await mysql.createConnection(config);
  }
  return connection;
}

export function handleCors(req, res) {
  // Set CORS headers for all API routes
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }
  return false;
}
