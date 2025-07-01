import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { Task } from "./schemas/Tasks";
import cron from "node-cron";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import announcementRoutes from "./routes/announcementRoutes";
import taskRoutes from "./routes/taskRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hsi";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/attendance", attendanceRoutes);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Schedule a cron job to soft delete overdue tasks every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const result = await Task.updateMany(
      { dayTime: { $lte: now }, deleted: { $ne: true } },
      { $set: { deleted: true, deletedAt: now } }
    );
    if (result.modifiedCount > 0) {
      console.log(`[CRON] Soft deleted ${result.modifiedCount} overdue tasks at ${now.toISOString()}`);
    }
  } catch (error) {
    console.error("[CRON] Error soft deleting overdue tasks:", error);
  }
});

const PORT = process.env.PORT || 10533;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
