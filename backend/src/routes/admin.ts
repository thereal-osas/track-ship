import express from "express";
import db from "../database";
import { authenticateToken } from "../middleware/auth";
import { broadcastToAll } from "../websocket";

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authenticateToken);

// Get all shipments
router.get("/shipments", async (req, res) => {
  const client = await db.connect();

  try {
    const result = await client.query(
      `SELECT 
        s.*,
        sc.name as sender_country,
        ss.name as sender_state,
        rc.name as recipient_country,
        rs.name as recipient_state
      FROM 
        shipments s
        LEFT JOIN countries sc ON s.sender_country_id = sc.id
        LEFT JOIN states ss ON s.sender_state_id = ss.id
        LEFT JOIN countries rc ON s.recipient_country_id = rc.id
        LEFT JOIN states rs ON s.recipient_state_id = rs.id
      ORDER BY s.created_at DESC`
    );

    const shipments = result.rows.map((shipment: any) => ({
      id: shipment.id,
      trackingNumber: shipment.tracking_number,
      status: shipment.status,
      origin: {
        country: shipment.sender_country,
        state: shipment.sender_state,
        address: `${shipment.sender_address}, ${shipment.sender_city}, ${shipment.sender_zip}`,
      },
      destination: {
        country: shipment.recipient_country,
        state: shipment.recipient_state,
        address: `${shipment.recipient_address}, ${shipment.recipient_city}, ${shipment.recipient_zip}`,
      },
      service: shipment.service,
      createdAt: shipment.created_at,
      estimatedDelivery: shipment.estimated_delivery,
    }));

    return res.json({
      success: true,
      data: shipments,
    });
  } catch (error) {
    console.error("Error fetching shipments:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch shipments",
    });
  } finally {
    client.release();
  }
});

// Get shipment by ID
router.get("/shipments/:id", async (req, res) => {
  const { id } = req.params;
  const client = await db.connect();

  try {
    // Get shipment details
    const shipmentResult = await client.query(
      `SELECT 
        s.*,
        sc.name as sender_country,
        ss.name as sender_state,
        rc.name as recipient_country,
        rs.name as recipient_state
      FROM 
        shipments s
        LEFT JOIN countries sc ON s.sender_country_id = sc.id
        LEFT JOIN states ss ON s.sender_state_id = ss.id
        LEFT JOIN countries rc ON s.recipient_country_id = rc.id
        LEFT JOIN states rs ON s.recipient_state_id = rs.id
      WHERE 
        s.id = $1`,
      [id]
    );

    if (shipmentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    const shipment = shipmentResult.rows[0];

    // Get shipment history
    const historyResult = await client.query(
      `SELECT * FROM shipment_history 
       WHERE shipment_id = $1 
       ORDER BY created_at DESC`,
      [id]
    );

    // Format response
    const formattedShipment = {
      id: shipment.id,
      trackingNumber: shipment.tracking_number,
      status: shipment.status,
      sender: {
        name: shipment.sender_name,
        email: shipment.sender_email,
        phone: shipment.sender_phone,
        address: shipment.sender_address,
        city: shipment.sender_city,
        state: shipment.sender_state,
        stateId: shipment.sender_state_id,
        zip: shipment.sender_zip,
        country: shipment.sender_country,
        countryId: shipment.sender_country_id,
      },
      recipient: {
        name: shipment.recipient_name,
        email: shipment.recipient_email,
        phone: shipment.recipient_phone,
        address: shipment.recipient_address,
        city: shipment.recipient_city,
        state: shipment.recipient_state,
        stateId: shipment.recipient_state_id,
        zip: shipment.recipient_zip,
        country: shipment.recipient_country,
        countryId: shipment.recipient_country_id,
      },
      service: shipment.service,
      weight: shipment.weight,
      dimensions: shipment.dimensions,
      createdAt: shipment.created_at,
      estimatedDelivery: shipment.estimated_delivery,
      history: historyResult.rows.map((item: any) => ({
        id: item.id,
        date: item.created_at,
        status: item.status,
        location: item.location,
        description: item.description,
      })),
    };

    return res.json({
      success: true,
      data: formattedShipment,
    });
  } catch (error) {
    console.error("Error fetching shipment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch shipment details",
    });
  } finally {
    client.release();
  }
});

// Create new shipment
router.post("/shipments", async (req, res) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const {
      senderName,
      senderEmail,
      senderPhone,
      senderAddress,
      senderCity,
      senderStateId,
      senderZip,
      senderCountryId,
      recipientName,
      recipientEmail,
      recipientPhone,
      recipientAddress,
      recipientCity,
      recipientStateId,
      recipientZip,
      recipientCountryId,
      weight,
      dimensions,
      service,
      estimatedDelivery,
    } = req.body;

    // Generate tracking number
    const trackingNumber =
      "TSE" + Math.floor(1000000000 + Math.random() * 9000000000);

    // Create shipment
    const shipmentResult = await client.query(
      `INSERT INTO shipments (
        tracking_number, status, sender_name, sender_email, sender_phone,
        sender_address, sender_city, sender_state_id, sender_zip, sender_country_id,
        recipient_name, recipient_email, recipient_phone, recipient_address,
        recipient_city, recipient_state_id, recipient_zip, recipient_country_id,
        weight, dimensions, service, estimated_delivery
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING id`,
      [
        trackingNumber,
        "Processing",
        senderName,
        senderEmail,
        senderPhone,
        senderAddress,
        senderCity,
        senderStateId,
        senderZip,
        senderCountryId,
        recipientName,
        recipientEmail,
        recipientPhone,
        recipientAddress,
        recipientCity,
        recipientStateId,
        recipientZip,
        recipientCountryId,
        weight,
        dimensions,
        service,
        estimatedDelivery,
      ]
    );

    const shipmentId = shipmentResult.rows[0].id;

    // Add initial history entry
    await client.query(
      `INSERT INTO shipment_history (shipment_id, status, location, description)
       VALUES ($1, $2, $3, $4)`,
      [
        shipmentId,
        "Processing",
        "Origin Facility",
        "Shipment has been created and is being processed",
      ]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      data: {
        id: shipmentId,
        trackingNumber,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating shipment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create shipment",
    });
  } finally {
    client.release();
  }
});

// Update shipment
router.put("/shipments/:id", async (req, res) => {
  const { id } = req.params;
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const {
      senderName,
      senderEmail,
      senderPhone,
      senderAddress,
      senderCity,
      senderStateId,
      senderZip,
      senderCountryId,
      recipientName,
      recipientEmail,
      recipientPhone,
      recipientAddress,
      recipientCity,
      recipientStateId,
      recipientZip,
      recipientCountryId,
      weight,
      dimensions,
      service,
      estimatedDelivery,
    } = req.body;

    // Update shipment
    const result = await client.query(
      `UPDATE shipments SET
        sender_name = $1, sender_email = $2, sender_phone = $3,
        sender_address = $4, sender_city = $5, sender_state_id = $6, sender_zip = $7, sender_country_id = $8,
        recipient_name = $9, recipient_email = $10, recipient_phone = $11,
        recipient_address = $12, recipient_city = $13, recipient_state_id = $14, recipient_zip = $15, recipient_country_id = $16,
        weight = $17, dimensions = $18, service = $19, estimated_delivery = $20
      WHERE id = $21
      RETURNING *`,
      [
        senderName,
        senderEmail,
        senderPhone,
        senderAddress,
        senderCity,
        senderStateId,
        senderZip,
        senderCountryId,
        recipientName,
        recipientEmail,
        recipientPhone,
        recipientAddress,
        recipientCity,
        recipientStateId,
        recipientZip,
        recipientCountryId,
        weight,
        dimensions,
        service,
        estimatedDelivery,
        id,
      ]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    await client.query("COMMIT");

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating shipment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update shipment",
    });
  } finally {
    client.release();
  }
});

// Delete shipment
router.delete("/shipments/:id", async (req, res) => {
  const { id } = req.params;
  const client = await db.connect();

  try {
    const result = await client.query(
      "DELETE FROM shipments WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    return res.json({
      success: true,
      message: "Shipment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting shipment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete shipment",
    });
  } finally {
    client.release();
  }
});

// Get all countries
router.get("/countries", async (req, res) => {
  const client = await db.connect();

  try {
    const result = await client.query("SELECT * FROM countries ORDER BY name");
    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch countries",
    });
  } finally {
    client.release();
  }
});

// Get all states
router.get("/states", async (req, res) => {
  const client = await db.connect();

  try {
    const result = await client.query(
      `SELECT s.*, c.name as country_name 
       FROM states s
       JOIN countries c ON s.country_id = c.id
       ORDER BY s.name`
    );

    // Ensure we're returning properly formatted data
    const states = result.rows.map((state) => ({
      id: state.id,
      name: state.name || "Unknown",
      code: state.code || "",
      country_id: state.country_id,
      countryName: state.country_name || "Unknown",
    }));

    return res.json({
      success: true,
      data: states,
    });
  } catch (error) {
    console.error("Error fetching states:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch states",
      data: [], // Always include an empty array as fallback
    });
  } finally {
    client.release();
  }
});

// Get states by country
router.get("/states/country/:countryId", async (req, res) => {
  const { countryId } = req.params;
  const client = await db.connect();

  try {
    const result = await client.query(
      `SELECT s.*, c.name as country_name 
       FROM states s
       JOIN countries c ON s.country_id = c.id
       WHERE s.country_id = $1
       ORDER BY s.name`,
      [countryId]
    );

    // Ensure we're returning properly formatted data
    const states = result.rows.map((state) => ({
      id: state.id,
      name: state.name || "Unknown",
      code: state.code || "",
      country_id: state.country_id,
      countryName: state.country_name || "Unknown",
    }));

    return res.json({
      success: true,
      data: states,
    });
  } catch (error) {
    console.error(`Error fetching states for country ${countryId}:`, error);
    return res.status(500).json({
      success: false,
      message: `Failed to fetch states for country ${countryId}`,
      data: [], // Always include an empty array as fallback
    });
  } finally {
    client.release();
  }
});

// Update shipment status
router.put("/shipments/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status, location, description } = req.body;
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Update shipment status
    const shipmentResult = await client.query(
      "UPDATE shipments SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (shipmentResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    // Add history entry
    await client.query(
      `INSERT INTO shipment_history (shipment_id, status, location, description)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [id, status, location, description]
    );

    await client.query("COMMIT");

    // Get updated shipment with history
    const updatedShipment = await client.query(
      `SELECT 
        s.*,
        sc.name as sender_country,
        ss.name as sender_state,
        rc.name as recipient_country,
        rs.name as recipient_state
      FROM 
        shipments s
        LEFT JOIN countries sc ON s.sender_country_id = sc.id
        LEFT JOIN states ss ON s.sender_state_id = ss.id
        LEFT JOIN countries rc ON s.recipient_country_id = rc.id
        LEFT JOIN states rs ON s.recipient_state_id = rs.id
      WHERE 
        s.id = $1`,
      [id]
    );

    const historyResult = await client.query(
      `SELECT * FROM shipment_history 
       WHERE shipment_id = $1 
       ORDER BY created_at DESC`,
      [id]
    );

    const shipment = updatedShipment.rows[0];
    const formattedShipment = {
      id: shipment.id,
      trackingNumber: shipment.tracking_number,
      status: shipment.status,
      origin: {
        country: shipment.sender_country,
        state: shipment.sender_state,
        address: `${shipment.sender_address}, ${shipment.sender_city}, ${shipment.sender_zip}`,
      },
      destination: {
        country: shipment.recipient_country,
        state: shipment.recipient_state,
        address: `${shipment.recipient_address}, ${shipment.recipient_city}, ${shipment.recipient_zip}`,
      },
      history: historyResult.rows.map((item: any) => ({
        id: item.id,
        date: item.created_at,
        status: item.status,
        location: item.location,
        description: item.description,
      })),
    };

    // Broadcast the update to all connected clients
    broadcastToAll({
      type: "shipment_update",
      trackingNumber: shipment.tracking_number,
      data: formattedShipment,
    });

    return res.json({
      success: true,
      data: formattedShipment,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating shipment status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update shipment status",
    });
  } finally {
    client.release();
  }
});

export default router;
