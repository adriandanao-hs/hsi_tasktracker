import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../schemas/User";
import { Router } from "express";

dotenv.config();

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const COOKIE_NAME = "auth_token";

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Invalid email or password" });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user!.passwordHash);
  if (!passwordMatch) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign(
    { _id: user!._id, email: user!.email, name: user!.name, role: user!.role },
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
    .json({ user: { name: user!.name, email: user!.email, role: user!.role } });
  return;
});

router.post("/register", async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name || !role) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409).json({ message: "User already exists" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = new User({
    email,
    passwordHash,
    name,
    role,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
    return;
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
})

// GET /api/auth/check
router.get("/me", (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) res.status(401).json({ message: "Unauthorized" });

  try {
    const user = jwt.verify(token, JWT_SECRET) as any;
    res.json({ user: user });
    return;
  } catch {
    res.status(401).json({ message: "Invalid token" });
    return;
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
  return;
});

export default router;
