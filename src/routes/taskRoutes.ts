import { Router } from "express";
import { Task } from "../schemas/Tasks";
import { COOKIE_NAME, JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";
import { model } from "mongoose";
import { User } from "../schemas/User";

const router = Router();

// Set up multer for file uploads
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET /api/task - Get tasks for current user (intern: their own, dept head: all in their depts)
router.get("/", async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as any;

    if (user.role === "Intern") {
      // Intern: only see their own tasks (not completed)
      const tasks = await Task.find({
        department: { $in: user.departments },
        "statusLog.userId": user._id,
        "statusLog.status": { $ne: "completed" },
      }).sort({ dayTime: -1 });
      res.json(tasks);
      return;
    } else if (user.role === "Department Head") {
      // Department Head: see all tasks for their departments
      const tasks = await Task.find({
        department: { $in: user.departments },
      }).sort({ dayTime: -1 });
      res.json(tasks);
      return;
    } else {
      // Other roles: return nothing or customize as needed
      res.json([]);
      return;
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

// GET /api/task/:id - Get specific task by ID
router.get("/:id", async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as any;
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Intern: can only access if in statusLog and not completed
    if (user.role === "Intern") {
      const log = task.statusLog.find(
        (log) => log.userId.toString() === user._id
      );
      if (!log || log.status === "completed") {
        res.status(403).json({ message: "Access denied" });
        return;
      }
      // Only return the intern's own log
      const filteredTask = { ...task.toObject(), statusLog: [log] };
      res.json(filteredTask);
      return;
    }
    // Department Head: can access if department matches
    if (user.role === "Department Head") {
      if (!user.departments.includes(task.department)) {
        res.status(403).json({ message: "Access denied" });
        return;
      }
      res.json(task);
      return;
    }
    // Other roles: deny
    res.status(403).json({ message: "Access denied" });
    return;
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

// PUT /api/task/:id/status - Update task status
router.put("/:id/status", upload.single("proofFile"), async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as any;
    const taskId = req.params.id;
    const { status } = req.body;

    if (!status || !["pending", "in-progress", "completed"].includes(status)) {
      res.status(400).json({ message: "Valid status is required" });
      return;
    }

    const task = await Task.findById(taskId);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Intern: can only update their own log if not completed
    if (user.role === "Intern") {
      const logIndex = task.statusLog.findIndex(
        (log) => log.userId.toString() === user._id
      );
      if (logIndex === -1 || task.statusLog[logIndex].status === "completed") {
        res.status(403).json({ message: "Access denied" });
        return;
      }
      let proofOfCompletion;
      if (status === "completed") {
        if (!req.file) {
          res.status(400).json({
            message: "Proof file is required when marking as completed",
          });
          return;
        }
        proofOfCompletion = {
          type: "file" as const,
          value: `/uploads/${req.file.filename}`,
        };
      }
      // Update the intern's log
      task.statusLog[logIndex].status = status;
      task.statusLog[logIndex].proofOfCompletion = proofOfCompletion;
      task.statusLog[logIndex].updatedAt = new Date();
      // Update overall status if all interns completed
      if (task.statusLog.every((log) => log.status === "completed")) {
        task.status = "completed";
      } else if (task.statusLog.some((log) => log.status === "in-progress")) {
        task.status = "in-progress";
      } else {
        task.status = "pending";
      }
      await task.save();
      res.json({ message: "Task status updated successfully", task });
      return;
    }
    // Department Head: not allowed to update status
    res.status(403).json({ message: "Only interns can update their status" });
    return;
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

// POST /api/task/create
router.post("/create", async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as any;
    const { taskName, dayTime, department, subject, details } = req.body;
    if (!taskName || !dayTime || !department || !subject || !details) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    // Find all interns in the department
    const interns = await model("User").find({
      role: "Intern",
      departments: department,
    });
    if (!interns.length) {
      res.status(400).json({ message: "No interns found in this department" });
      return;
    }
    // Create statusLog for all interns
    const statusLog = interns.map((intern: any) => ({
      userId: intern._id,
      userName: intern.name,
      status: "pending",
      updatedAt: new Date(),
    }));
    const newTask = new Task({
      taskName,
      dayTime,
      department,
      subject,
      details,
      statusLog,
    });
    await newTask.save();
    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
    return;
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

// GET /api/task/intern/:userId - Get all tasks for a specific intern
router.get("/intern/:userId", async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as any;
    const { userId } = req.params;

    // Only department heads can access this endpoint
    if (user.role !== "Department Head") {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    // Get the intern's details to verify department access
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

    // Get all tasks where the intern is in the statusLog
    const tasks = await Task.find({
      "statusLog.userId": userId,
      department: { $in: user.departments },
    }).sort({ dayTime: -1 });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching intern tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Serve uploaded files statically
router.use("/uploads", (req, res, next) => {
  express.static(uploadDir)(req, res, next);
});

export default router;
