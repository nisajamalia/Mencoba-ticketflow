#!/usr/bin/env node

/**
 * Automatic Database Setup for Railway MySQL
 * This script sets up a free Railway MySQL database for your project
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

console.log("🎫 TicketFlow - Automatic Database Setup");
console.log("=========================================\n");

async function setupRailwayDatabase() {
  try {
    console.log("📦 Step 1: Installing Railway CLI...");

    // Check if Railway CLI is installed
    try {
      execSync("railway --version", { stdio: "pipe" });
      console.log("✅ Railway CLI already installed\n");
    } catch {
      console.log("⬇️ Installing Railway CLI...");

      // Install Railway CLI
      if (process.platform === "win32") {
        execSync("npm install -g @railway/cli", { stdio: "inherit" });
      } else {
        execSync("curl -fsSL https://railway.app/install.sh | sh", {
          stdio: "inherit",
        });
      }
      console.log("✅ Railway CLI installed\n");
    }

    console.log("🔐 Step 2: Login to Railway...");
    console.log("This will open your browser for authentication.");
    execSync("railway login", { stdio: "inherit" });

    console.log("\n📊 Step 3: Creating MySQL database...");

    // Create new Railway project
    execSync("railway init", { stdio: "inherit" });

    // Add MySQL service
    execSync("railway add --mysql", { stdio: "inherit" });

    console.log("\n⚡ Step 4: Getting database credentials...");

    // Get database URL
    const dbUrl = execSync("railway variables --json", { encoding: "utf8" });
    const variables = JSON.parse(dbUrl);

    const databaseUrl = variables.DATABASE_URL || variables.MYSQL_URL;

    if (databaseUrl) {
      console.log("✅ Database created successfully!\n");
      console.log("🔗 Database URL:", databaseUrl);

      // Parse database URL
      const url = new URL(databaseUrl);
      const dbConfig = {
        DB_HOST: url.hostname,
        DB_USER: url.username,
        DB_PASSWORD: url.password,
        DB_NAME: url.pathname.substring(1),
        DB_PORT: url.port || "3306",
      };

      console.log("\n📝 Environment Variables for Vercel:");
      console.log("=====================================");
      Object.entries(dbConfig).forEach(([key, value]) => {
        console.log(`${key}=${value}`);
      });

      // Create .env file for local development
      const envContent = Object.entries(dbConfig)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");

      writeFileSync(".env.local", envContent);
      console.log("\n✅ Created .env.local for local development");

      console.log("\n🚀 Next Steps:");
      console.log("1. Copy the environment variables above");
      console.log("2. Go to your Vercel project settings");
      console.log("3. Add them to Environment Variables");
      console.log("4. Redeploy your project");
      console.log("\n🎯 Your database is ready for production!");
    } else {
      throw new Error("Could not retrieve database URL");
    }
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
    console.log("\n🔧 Manual Setup Instructions:");
    console.log("1. Go to https://railway.app");
    console.log("2. Create new project");
    console.log("3. Add MySQL service");
    console.log("4. Copy connection details to Vercel");
  }
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupRailwayDatabase();
}

export { setupRailwayDatabase };
