import { CookieOptions } from "express";

// JWT configuration
export const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
export const COOKIE_NAME = "auth_token";

// Cookie configuration
export const getCookieConfig = (): CookieOptions => ({
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 3600000, // 1 hour
  path: "/"
});
