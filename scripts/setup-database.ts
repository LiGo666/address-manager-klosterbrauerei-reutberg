#!/usr/bin/env node

/**
 * Database Validation Script
 * 
 * This script validates that the database schema is properly set up.
 * It will:
 * 1. Check if the members table exists
 * 2. Validate the table structure (all required columns)
 * 3. Exit with error code if validation fails (causing build to fail)
 */

// Load environment variables from .env files
import { config } from "dotenv"
import { resolve } from "path"

// Try to load .env.local first, then .env
config({ path: resolve(process.cwd(), ".env.local") })
config({ path: resolve(process.cwd(), ".env") })

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL) {
  console.error("❌ ERROR: NEXT_PUBLIC_SUPABASE_URL environment variable is not set")
  process.exit(1)
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ ERROR: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Required columns in the members table
const REQUIRED_COLUMNS = [
  "id",
  "customer_number",
  "first_name",
  "last_name",
  "street",
  "postal_code",
  "city",
  "token",
  "expiry_date",
  "modified",
  "original_street",
  "original_postal_code",
  "original_city",
  "created_at",
]

async function checkTableExists(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("members")
      .select("id")
      .limit(1)

    if (error) {
      // If error code is 42P01 or PGRST116, table doesn't exist
      if (
        error.code === "42P01" ||
        error.code === "PGRST116" ||
        error.message.includes("does not exist") ||
        error.message.includes("relation") ||
        error.message.includes("Could not find")
      ) {
        return false
      }
      throw error
    }
    return true
  } catch (error: any) {
    if (
      error.code === "42P01" ||
      error.code === "PGRST116" ||
      error.message?.includes("does not exist") ||
      error.message?.includes("relation") ||
      error.message?.includes("Could not find")
    ) {
      return false
    }
    throw error
  }
}

async function validateTableStructure(): Promise<{ valid: boolean; missingColumns: string[] }> {
  try {
    // Try to select all required columns
    const { data, error } = await supabase
      .from("members")
      .select(REQUIRED_COLUMNS.join(", "))
      .limit(0)

    if (error) {
      // Parse error to find missing columns
      const missingColumns: string[] = []
      
      // Check each required column
      for (const column of REQUIRED_COLUMNS) {
        try {
          const { error: colError } = await supabase
            .from("members")
            .select(column)
            .limit(0)
          
          if (colError) {
            missingColumns.push(column)
          }
        } catch {
          missingColumns.push(column)
        }
      }

      return { valid: false, missingColumns }
    }

    return { valid: true, missingColumns: [] }
  } catch (error: any) {
    console.error("❌ Table structure validation error:", error.message)
    return { valid: false, missingColumns: REQUIRED_COLUMNS }
  }
}

async function validateDatabase(): Promise<void> {
  console.log("🔍 Validating database schema...")

  const tableExists = await checkTableExists()

  if (!tableExists) {
    console.error("")
    console.error("❌ ERROR: Members table does not exist!")
    console.error("")
    console.error("   The 'members' table is required for the application to work.")
    console.error("   Please create it by running the SQL script in Supabase:")
    console.error("")
    console.error("   1. Go to your Supabase project dashboard")
    console.error("   2. Navigate to SQL Editor")
    console.error("   3. Copy and run the contents of: scripts/setup-database.sql")
    console.error("")
    console.error("   Or use the Supabase CLI:")
    console.error("   supabase db reset")
    console.error("")
    process.exit(1)
  }

  console.log("✅ Members table exists")

  // Validate structure
  console.log("🔍 Validating table structure...")
  const { valid, missingColumns } = await validateTableStructure()

  if (!valid) {
    console.error("")
    console.error("❌ ERROR: Database schema validation failed!")
    console.error("")
    if (missingColumns.length > 0) {
      console.error("   Missing columns:")
      missingColumns.forEach((col) => console.error(`     - ${col}`))
      console.error("")
    }
    console.error("   Please run scripts/setup-database.sql in Supabase SQL Editor")
    console.error("   to ensure all required columns exist.")
    console.error("")
    process.exit(1)
  }

  console.log("✅ All required columns exist")
  console.log("✅ Database schema is valid")
}

// Main execution
validateDatabase()
  .then(() => {
    console.log("✅ Database validation complete")
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Database validation failed:", error.message)
    console.error("")
    console.error("   Please ensure:")
    console.error("   1. Supabase is accessible")
    console.error("   2. Environment variables are set correctly")
    console.error("   3. The members table exists with all required columns")
    console.error("")
    process.exit(1)
  })
