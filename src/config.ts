import { CookieOptions } from "express";

// JWT configuration
export const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
export const COOKIE_NAME = "auth_token";

// Cookie configuration
export const getCookieConfig = (): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const,
  maxAge: 3600000, // 1 hour
  path: "/"
});
