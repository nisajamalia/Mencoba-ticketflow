#!/usr/bin/env node

/**
 * One-Click Deployment Script for TicketFlow
 * Automatically sets up database and deploys to Vercel
 */

import { execSync } from "child_process";
import { setupRailwayDatabase } from "./setup-database.js";
import { seedDatabase } from "./seed-database.js";

console.log("🚀 TicketFlow - One-Click Deployment");
console.log("===================================\n");

async function deployToVercel() {
  try {
    console.log("📋 Step 1: Setting up database...");
    await setupRailwayDatabase();

    console.log("\n🌱 Step 2: Seeding database...");
    await seedDatabase();

    console.log("\n🚀 Step 3: Deploying to Vercel...");

    // Check if Vercel CLI is installed
    try {
      execSync("vercel --version", { stdio: "pipe" });
    } catch {
      console.log("📦 Installing Vercel CLI...");
      execSync("npm install -g vercel", { stdio: "inherit" });
    }

    console.log("🔐 Login to Vercel (if not already logged in)...");
    try {
      execSync("vercel whoami", { stdio: "pipe" });
    } catch {
      execSync("vercel login", { stdio: "inherit" });
    }

    console.log("⚡ Deploying to production...");
    execSync("vercel --prod", { stdio: "inherit" });

    console.log("\n🎉 Deployment Complete!");
    console.log("🌐 Your TicketFlow system is now live!");
    console.log("\n📊 What was deployed:");
    console.log("   ✅ Vue.js frontend with responsive design");
    console.log("   ✅ Node.js serverless API functions");
    console.log("   ✅ MySQL database with sample data");
    console.log("   ✅ Dashboard with real-time statistics");
    console.log("\n🎯 Next steps:");
    console.log("   1. Visit your Vercel URL");
    console.log("   2. Login with: admin@ticketflow.com / password");
    console.log("   3. Start managing tickets!");
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    console.log("\n🔧 Manual deployment:");
    console.log("1. Run: npm run setup-db");
    console.log("2. Copy environment variables to Vercel");
    console.log("3. Run: vercel --prod");
    process.exit(1);
  }
}

// Auto-detect if running as main script
if (import.meta.url === `file://${process.argv[1]}`) {
  deployToVercel();
}

export { deployToVercel };
