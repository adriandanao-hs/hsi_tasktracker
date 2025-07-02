import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../schemas/User";
import { Router } from "express";
import { COOKIE_NAME, JWT_SECRET, getCookieConfig } from "../config";
import { CookieOptions } from "express";

dotenv.config();

const router = Router();

// Cookie options based on environment
const getCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" as const : "strict" as const,
  maxAge: 3600000, // 1 hour
  path: "/",
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    if (!email || !password) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      console.log('Invalid password for:', email);
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.departments[0],
        departments: user.departments,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log('Login successful for:', email);
    
    res
      .cookie(COOKIE_NAME, token, getCookieConfig())
      .json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          photo: user.photo,
          role: user.role,
          department: user.departments[0],
          departments: user.departments,
        },
      });
  } catch (err) {
    const error = err as Error;
    console.error('Login error:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
    return;
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, name, role, departments } = req.body;
    console.log('Registration attempt for:', email);

    if (
      !email ||
      !password ||
      !name ||
      !role ||
      !departments ||
      !Array.isArray(departments) ||
      departments.length === 0
    ) {
      res.status(400).json({
        message:
          "All fields are required. Departments must be an array with at least one department.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      passwordHash,
      name,
      role,
      departments,
    });

    await newUser.save();
    console.log('Registration successful for:', email);
    res.status(201).json({ message: "User registered successfully" });
    return;
  } catch (err) {
    const error = err as Error;
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
    return;
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  try {
    res.clearCookie(COOKIE_NAME, getCookieConfig());
    res.json({ message: "Logged out" });
    return;
  } catch (err) {
    const error = err as Error;
    console.error('Logout error:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
    return;
  }
});

export default router;
