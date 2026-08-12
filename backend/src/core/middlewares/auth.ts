import { NextRequest } from "next/server";
import { verifyToken } from "../utils/jwt";
import { UnauthorizedError } from "../errors/AppError";

/**
 * Authentication middleware.
 * Extracts JWT from HttpOnly cookie, verifies it, and returns the userId.
 * Throws UnauthorizedError if invalid or missing.
 */
export const extractUserFromAuth = (req: NextRequest): string => {
  const token = req.cookies.get("accessToken")?.value;
  if (!token) {
    throw new UnauthorizedError("No access token provided");
  }

  try {
    const decoded = verifyToken(token);
    return decoded.userId;
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired access token");
  }
};
