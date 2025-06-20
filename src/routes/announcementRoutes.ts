import { Router } from "express";
import { Announcement } from "../schemas/Announcements";
import { COOKIE_NAME, JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/post", async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as any;

    const { title, message, departments } = req.body;

    if (!title || !message) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }

    const newAnnouncement = new Announcement({
      user: user._id,
      title,
      message,
      departments,
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
  const { department } = req.query;

  try {
    let query = {};

    if (department) {
      query = { departments: department }; // matches if department exists in the array
    }

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
