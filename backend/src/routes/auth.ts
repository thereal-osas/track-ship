import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../database";
import { authenticateToken } from "../middleware/auth";

// Define the JWT payload interface
interface JwtUserPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const client = await db.connect();

  try {
    // Find user by email
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  } finally {
    client.release();
  }
});

// Register route (admin only)
router.post("/register", authenticateToken, async (req, res) => {
  // Check if user is admin
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized: Admin access required",
    });
  }

  const { email, password, role } = req.body;
  const client = await db.connect();

  try {
    // Check if user already exists
    const existingUser = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const result = await client.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [email, hashedPassword, role || "user"]
    );

    return res.status(201).json({
      success: true,
      data: {
        user: result.rows[0],
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration",
    });
  } finally {
    client.release();
  }
});

// Add token verification endpoint
router.get("/verify", authenticateToken, (req, res) => {
  // If the middleware passes, the token is valid
  return res.json({
    success: true,
    message: "Token is valid",
    data: {
      user: {
        id: req.user?.id,
        email: req.user?.email,
        role: req.user?.role,
      },
    },
  });
});

// Get current user
router.get("/me", authenticateToken, async (req, res) => {
  return res.json({
    success: true,
    data: {
      user: {
        id: req.user?.id,
        email: req.user?.email,
        role: req.user?.role,
      },
    },
  });
});

// Modified endpoint to allow creating additional admin users
router.post("/create-additional-admin", async (req, res) => {
  const { email, password, secretKey } = req.body;

  // Check the secret key (set this in your environment variables)
  if (secretKey !== process.env.ADMIN_CREATION_SECRET) {
    return res.status(403).json({
      success: false,
      message: "Invalid secret key",
    });
  }

  const client = await db.connect();

  try {
    // Check if user already exists
    const existingUser = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    await client.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3)",
      [email, hashedPassword, "admin"]
    );

    return res.status(201).json({
      success: true,
      message: "Admin user created successfully",
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create admin user",
    });
  } finally {
    client.release();
  }
});

export default router;
