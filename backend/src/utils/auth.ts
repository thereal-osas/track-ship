import jwt from 'jsonwebtoken';

export const verifyToken = (token: string): any | null => {
  try {
    return jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback-secret'
    );
  } catch (error) {
    return null;
  }
};