import { Router } from "express";
import { Announcement } from "../schemas/Announcements";
import { COOKIE_NAME, JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";
import dbConnect from "../lib/db";

const router = Router();

router.post("/post", async (req, res) => {
  await dbConnect();
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as any;

    const { title, message, departments, expiresAt } = req.body;

    if (!title || !message) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }

    const newAnnouncement = new Announcement({
      user: user._id,
      title,
      message,
      departments,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    await newAnnouncement.save();

    res
      .status(201)
      .json({ message: "Announcement posted", announcement: newAnnouncement });
    return;
  } catch (error) {
    console.error("Error posting announcement:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

router.get("/", async (req, res) => {
  await dbConnect();
  const { department } = req.query;

  try {
    let query = {};

    if (department) {
      // Handle multiple department parameters
      const departments = Array.isArray(department) ? department : [department];
      query = { departments: { $in: departments } }; // matches if any department exists in the array
    }

    // Add filter to exclude expired announcements
    const now = new Date();
    query = {
      ...query,
      $or: [
        { expiresAt: { $exists: false } }, // No expiration date
        { expiresAt: { $gt: now } }, // Not expired yet
      ],
    };

    const announcements = await Announcement.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "name photo"); // optional: populate user info

    res.json(announcements);
    return;
  } catch (err) {
    console.error("Error fetching announcements:", err);
    res.status(500).json({ message: "Failed to fetch announcements" });
    return;
  }
});

export default router;
