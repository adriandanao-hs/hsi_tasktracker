import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const router = Router();

// Static test user
const mockUser = {
  email: "adrian.danao22@gmail.com",
  name: "Adrian Danao",
  passwordHash: bcrypt.hashSync("password123", 10),
};

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const COOKIE_NAME = "auth_token";

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Invalid email or password" });
  }

  // ✅ Check email
  if (email !== mockUser.email) {
    res.status(401).json({ message: "Invalid email or password" });
  }

  const passwordMatch = await bcrypt.compare(password, mockUser.passwordHash);
  if (!passwordMatch) {
    res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { email: mockUser.email, name: mockUser.name },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res
    .cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    })
    .json({ user: { name: mockUser.name, email: mockUser.email } });
});

// GET /api/auth/check
router.get("/check", (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) res.status(401).json({ message: "Unauthorized" });

  try {
    const user = jwt.verify(token, JWT_SECRET) as {
      email: string;
      name: string;
    };
    res.json({ user });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

// POST /api/auth/logout
router.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out" });
});

export default router;
