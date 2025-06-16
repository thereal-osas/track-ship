import express from "express";
import db from "../database";

const router = express.Router();

// Get shipment by tracking number
router.get("/:trackingNumber", async (req, res) => {
  const { trackingNumber } = req.params;
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
        s.tracking_number = $1`,
      [trackingNumber]
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
      [shipment.id]
    );

    // Format response
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

export default router;
