import { Pool } from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

async function createSchema() {
  // Create a new database connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });

  try {
    const client = await pool.connect();
    console.log("Connected to database successfully");

    try {
      // Read the schema SQL file
      const schemaPath = path.join(__dirname, "schema.sql");
      console.log(`Reading schema from: ${schemaPath}`);

      if (!fs.existsSync(schemaPath)) {
        throw new Error(`Schema file not found at: ${schemaPath}`);
      }

      const schemaSql = fs.readFileSync(schemaPath, "utf8");
      console.log("Schema SQL loaded successfully");

      // Execute the schema SQL
      console.log("Creating database schema...");
      await client.query(schemaSql);
      console.log("Database schema created successfully");

      // Verify the shipments table has the sender_name column
      const result = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'shipments' AND column_name = 'sender_name'
      `);

      if (result.rows.length === 0) {
        console.error(
          "ERROR: sender_name column was not created in shipments table!"
        );

        // Try to add the column if it doesn't exist
        console.log("Attempting to add sender_name column...");
        await client.query(`
          ALTER TABLE shipments 
          ADD COLUMN IF NOT EXISTS sender_name VARCHAR(100) NOT NULL DEFAULT 'Unknown'
        `);
        console.log("sender_name column added");
      } else {
        console.log("sender_name column exists in shipments table");
      }
    } catch (error) {
      console.error("Error creating database schema:", error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the schema creation
createSchema()
  .then(() => {
    console.log("Schema creation completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Schema creation failed:", error);
    process.exit(1);
  });
