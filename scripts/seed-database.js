#!/usr/bin/env node

/**
 * Database Seeder for Railway MySQL
 * Populates the database with sample data for the ticketing system
 */

import mysql from "mysql2/promise";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seedDatabase() {
  console.log("🌱 Seeding database with sample data...\n");

  try {
    // Connect to database using environment variables
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      ssl: { rejectUnauthorized: false },
    });

    console.log("✅ Connected to database");

    // Read and execute schema
    const schemaPath = join(__dirname, "..", "database_schema.sql");
    const schema = readFileSync(schemaPath, "utf8");

    // Split schema into individual statements
    const statements = schema
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

    console.log("📊 Creating tables...");
    for (const statement of statements) {
      if (
        statement.includes("CREATE TABLE") ||
        statement.includes("INSERT INTO")
      ) {
        await connection.execute(statement);
      }
    }

    console.log("✅ Tables created");

    // Insert sample data
    console.log("👥 Adding users...");

    // Admin user
    await connection.execute(`
      INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES
      ('Admin User', 'admin@ticketflow.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxkuQjKqtH4p1.Bo5wqlnc7mUWG', 'admin', NOW(), NOW())
    `);

    // Sample users
    const users = [
      "John Smith",
      "Jane Doe",
      "Mike Johnson",
      "Sarah Wilson",
      "David Brown",
      "Lisa Davis",
      "Chris Miller",
      "Amanda Taylor",
      "Kevin Anderson",
      "Jessica Martinez",
    ];

    for (let i = 0; i < users.length; i++) {
      const name = users[i];
      const email = name.toLowerCase().replace(" ", ".") + "@example.com";
      await connection.execute(
        `
        INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES
        (?, ?, '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxkuQjKqtH4p1.Bo5wqlnc7mUWG', 'user', NOW(), NOW())
      `,
        [name, email]
      );
    }

    console.log("🎫 Adding sample tickets...");

    // Add sample tickets across all categories and statuses
    const ticketTitles = [
      "Login page not loading",
      "Add dark mode feature",
      "Database connection timeout",
      "Password reset not working",
      "How to export data",
      "Payment failed error",
      "Mobile app crashes",
      "Need API documentation",
      "Slow query performance",
      "Account locked issue",
      "Feature request: notifications",
      "Billing dispute",
    ];

    const statuses = ["open", "in_progress", "closed", "resolved"];
    const priorities = ["low", "medium", "high", "urgent"];

    for (let i = 0; i < 50; i++) {
      const title = ticketTitles[i % ticketTitles.length] + ` #${i + 1}`;
      const description = `This is a sample ticket description for ${title}. It contains detailed information about the issue or request.`;
      const status = statuses[i % statuses.length];
      const priority = priorities[i % priorities.length];
      const userId = (i % 10) + 2; // Users 2-11
      const categoryId = (i % 6) + 1; // Categories 1-6

      await connection.execute(
        `
        INSERT INTO tickets (title, description, status, priority, user_id, category_id, created_at, updated_at) VALUES
        (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
        [title, description, status, priority, userId, categoryId]
      );
    }

    console.log("💬 Adding sample comments...");

    // Add sample comments
    for (let i = 1; i <= 20; i++) {
      await connection.execute(
        `
        INSERT INTO comments (ticket_id, user_id, content, created_at, updated_at) VALUES
        (?, ?, 'This is a sample comment for ticket ${i}', NOW(), NOW())
      `,
        [i, 1]
      ); // Admin comments
    }

    await connection.end();

    console.log("\n🎉 Database seeded successfully!");
    console.log("📊 Data added:");
    console.log("   - 11 users (1 admin + 10 regular)");
    console.log("   - 6 categories");
    console.log("   - 50 tickets");
    console.log("   - 20 comments");
    console.log("\n🚀 Your database is ready for production!");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

// Run seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase };
