import { Pool } from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });

  const client = await pool.connect();
  console.log("Connected to database successfully");

  try {
    // Begin transactions
    await client.query("BEGIN");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await client.query(
      `INSERT INTO users (email, password, role) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (email) DO NOTHING`,
      ["admin@example.com", hashedPassword, "admin"]
    );
    console.log("Admin user created");

    // Seed countries
    const countries = [
      { name: "United States", code: "US" },
      { name: "Canada", code: "CA" },
      { name: "United Kingdom", code: "GB" },
      { name: "Australia", code: "AU" },
      { name: "Germany", code: "DE" },
    ];

    for (const country of countries) {
      await client.query(
        `INSERT INTO countries (name, code) 
         VALUES ($1, $2) 
         ON CONFLICT (code) DO NOTHING 
         RETURNING id`,
        [country.name, country.code]
      );
    }
    console.log("Countries created");

    // Seed states for US
    const usResult = await client.query(
      `SELECT id FROM countries WHERE code = 'US'`
    );
    const usId = usResult.rows[0].id;

    const usStates = [
      { name: "California", code: "CA" },
      { name: "New York", code: "NY" },
      { name: "Texas", code: "TX" },
    ];

    for (const state of usStates) {
      await client.query(
        `INSERT INTO states (name, code, country_id) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (code, country_id) DO NOTHING`,
        [state.name, state.code, usId]
      );
    }
    console.log("US states created");

    // Seed states for Canada
    const caResult = await client.query(
      `SELECT id FROM countries WHERE code = 'CA'`
    );
    const caId = caResult.rows[0].id;

    const caProvinces = [
      { name: "Ontario", code: "ON" },
      { name: "Quebec", code: "QC" },
      { name: "British Columbia", code: "BC" },
    ];

    for (const province of caProvinces) {
      await client.query(
        `INSERT INTO states (name, code, country_id) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (code, country_id) DO NOTHING`,
        [province.name, province.code, caId]
      );
    }
    console.log("Canadian provinces created");

    // Seed states for UK
    const ukResult = await client.query(
      `SELECT id FROM countries WHERE code = 'GB'`
    );
    const ukId = ukResult.rows[0].id;

    const ukRegions = [
      { name: "England", code: "ENG" },
      { name: "Scotland", code: "SCT" },
      { name: "Wales", code: "WLS" },
    ];

    for (const region of ukRegions) {
      await client.query(
        `INSERT INTO states (name, code, country_id) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (code, country_id) DO NOTHING`,
        [region.name, region.code, ukId]
      );
    }
    console.log("UK regions created");

    // Get state IDs for sample shipments
    const caStateResult = await client.query(
      `SELECT id FROM states WHERE code = 'CA' AND country_id = $1`,
      [usId]
    );
    const caStateId = caStateResult.rows[0].id;

    const nyStateResult = await client.query(
      `SELECT id FROM states WHERE code = 'NY' AND country_id = $1`,
      [usId]
    );
    const nyStateId = nyStateResult.rows[0].id;

    const onProvinceResult = await client.query(
      `SELECT id FROM states WHERE code = 'ON' AND country_id = $1`,
      [caId]
    );
    const onProvinceId = onProvinceResult.rows[0].id;

    const engRegionResult = await client.query(
      `SELECT id FROM states WHERE code = 'ENG' AND country_id = $1`,
      [ukId]
    );
    const engRegionId = engRegionResult.rows[0].id;

    // Seed sample shipments
    const shipments = [
      {
        trackingNumber:
          "TSE" + Math.floor(1000000000 + Math.random() * 9000000000),
        status: "In Transit",
        senderName: "John Doe",
        senderEmail: "john@example.com",
        senderPhone: "123-456-7890",
        senderAddress: "123 Main St",
        senderCity: "Los Angeles",
        senderStateId: caStateId,
        senderZip: "90001",
        senderCountryId: usId,
        recipientName: "Jane Smith",
        recipientEmail: "jane@example.com",
        recipientPhone: "987-654-3210",
        recipientAddress: "456 Park Ave",
        recipientCity: "New York",
        recipientStateId: nyStateId,
        recipientZip: "10001",
        recipientCountryId: usId,
        weight: 5.2,
        dimensions: "12x10x8",
        service: "Express",
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      },
      {
        trackingNumber:
          "TSE" + Math.floor(1000000000 + Math.random() * 9000000000),
        status: "Processing",
        senderName: "Alice Johnson",
        senderEmail: "alice@example.com",
        senderPhone: "555-123-4567",
        senderAddress: "789 Oak St",
        senderCity: "Toronto",
        senderStateId: onProvinceId,
        senderZip: "M5V 2H1",
        senderCountryId: caId,
        recipientName: "Bob Williams",
        recipientEmail: "bob@example.com",
        recipientPhone: "555-987-6543",
        recipientAddress: "321 Pine St",
        recipientCity: "London",
        recipientStateId: engRegionId,
        recipientZip: "SW1A 1AA",
        recipientCountryId: ukId,
        weight: 2.8,
        dimensions: "8x6x4",
        service: "Standard",
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    ];

    for (const shipment of shipments) {
      const result = await client.query(
        `INSERT INTO shipments (
          tracking_number, status, 
          sender_name, sender_email, sender_phone, sender_address, sender_city, sender_state_id, sender_zip, sender_country_id,
          recipient_name, recipient_email, recipient_phone, recipient_address, recipient_city, recipient_state_id, recipient_zip, recipient_country_id,
          weight, dimensions, service, estimated_delivery
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        RETURNING id`,
        [
          shipment.trackingNumber,
          shipment.status,
          shipment.senderName,
          shipment.senderEmail,
          shipment.senderPhone,
          shipment.senderAddress,
          shipment.senderCity,
          shipment.senderStateId,
          shipment.senderZip,
          shipment.senderCountryId,
          shipment.recipientName,
          shipment.recipientEmail,
          shipment.recipientPhone,
          shipment.recipientAddress,
          shipment.recipientCity,
          shipment.recipientStateId,
          shipment.recipientZip,
          shipment.recipientCountryId,
          shipment.weight,
          shipment.dimensions,
          shipment.service,
          shipment.estimatedDelivery,
        ]
      );

      const shipmentId = result.rows[0].id;

      // Add shipment history
      await client.query(
        `INSERT INTO shipment_history (shipment_id, status, location, description)
         VALUES ($1, $2, $3, $4)`,
        [
          shipmentId,
          "Processing",
          "Origin Facility",
          "Shipment has been processed at origin facility",
        ]
      );

      if (shipment.status === "In Transit") {
        await client.query(
          `INSERT INTO shipment_history (shipment_id, status, location, description)
           VALUES ($1, $2, $3, $4)`,
          [
            shipmentId,
            "In Transit",
            "Transit Hub",
            "Shipment is in transit to destination",
          ]
        );
      }
    }
    console.log("Sample shipments created");

    // Commit transaction
    await client.query("COMMIT");
    console.log("Database seeded successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log("Seed completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
