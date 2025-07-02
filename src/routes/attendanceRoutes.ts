import { Router } from "express";
import Attendance from "../schemas/Attendance";
import { COOKIE_NAME, JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";
import { User } from "../schemas/User";
import dbConnect from "../lib/db";

const router = Router();

// Check-in route
router.post("/checkin", async (req, res) => {
  await dbConnect();
  try {
    const { userId, notes } = req.body;
    const today = new Date();
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // Prevent multiple check-ins for the same day
    const existing = await Attendance.findOne({ userId, date });
    if (existing) {
      res.status(400).json({ message: "Already checked in for today." });
      return;
    }

    const attendance = await Attendance.create({
      userId,
      date,
      checkIn: today,
      notes,
    });
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: "Check-in failed", error: err });
  }
});

// Check-out route
router.post("/checkout", async (req, res) => {
  await dbConnect();
  try {
    const { userId } = req.body;
    const today = new Date();
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const attendance = await Attendance.findOne({ userId, date });
    if (!attendance) {
      res.status(404).json({ message: "No check-in found for today." });
      return;
    }
    if (attendance.checkOut) {
      res.status(400).json({ message: "Already checked out for today." });
      return;
    }
    attendance.checkOut = today;
    await attendance.save();
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: "Check-out failed", error: err });
  }
});

// Attendance history route
router.get("/history/:userId", async (req, res) => {
  await dbConnect();
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as any;
    const { userId } = req.params;

    // If user is an intern, they can only see their own attendance
    if (user.role === "Intern" && user._id !== userId) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    // If user is a department head, they can only see attendance of interns in their departments
    if (user.role === "Department Head") {
      const intern = await User.findById(userId);
      if (!intern || intern.role !== "Intern") {
        res.status(404).json({ message: "Intern not found" });
        return;
      }

      // Check if the department head has access to the intern's department
      const hasAccess = intern.departments.some((dept) =>
        user.departments.includes(dept)
      );
      if (!hasAccess) {
        res.status(403).json({ message: "Access denied" });
        return;
      }
    }

    const history = await Attendance.find({ userId }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    console.error("Error fetching attendance history:", err);
    res.status(500).json({ message: "Failed to fetch history", error: err });
  }
});

export default router;
