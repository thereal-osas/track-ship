import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define the JWT payload interface
interface JwtUserPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as JwtUserPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

export const verifyToken = (token: string): JwtUserPayload | null => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as JwtUserPayload;
  } catch (error) {
    return null;
  }
};
