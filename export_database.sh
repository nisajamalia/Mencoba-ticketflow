#!/bin/bash

# Database Export Script for Vercel Deployment
# This script exports your current database for use with external database services

# Configuration
DB_HOST="localhost"
DB_USER="root"
DB_NAME="ticketing_system"
OUTPUT_FILE="ticketing_system_export.sql"

echo "🎫 Ticketing System Database Export"
echo "=================================="
echo ""
echo "This will export your current database for Vercel deployment."
echo "Make sure your MySQL server is running and accessible."
echo ""

# Prompt for password
echo -n "Enter MySQL password for user '$DB_USER': "
read -s DB_PASSWORD
echo ""
echo ""

# Export database
echo "📤 Exporting database..."
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD --single-transaction --routines --triggers $DB_NAME > $OUTPUT_FILE

if [ $? -eq 0 ]; then
    echo "✅ Database exported successfully to: $OUTPUT_FILE"
    echo ""
    echo "📊 Export Statistics:"
    echo "   File size: $(du -h $OUTPUT_FILE | cut -f1)"
    echo "   Lines: $(wc -l < $OUTPUT_FILE)"
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Create account on PlanetScale, Railway, or Supabase"
    echo "2. Import this SQL file to your cloud database"
    echo "3. Get connection string from your database provider"
    echo "4. Deploy to Vercel with environment variables"
    echo ""
    echo "📋 You'll need these environment variables in Vercel:"
    echo "   DB_HOST=your-cloud-database-host"
    echo "   DB_USER=your-database-user"
    echo "   DB_PASSWORD=your-database-password"
    echo "   DB_NAME=your-database-name"
    echo "   DB_PORT=3306"
else
    echo "❌ Export failed. Please check your credentials and database connection."
fi