import { Router } from "express";
import { User } from "../schemas/User";
import multer from "multer";
import path from "path";
import fs from "fs";
import { COOKIE_NAME, JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";

const router = Router();

// Set up multer for file uploads
const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp' : path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
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

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get user profile
router.get("/me", async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Fetch the complete user data from the database
    const user = await User.findById(decoded._id).select("-passwordHash");

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      department: user.departments[0],
      departments: user.departments,
      role: user.role,
    });
    return;
  } catch {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
});

// Update user photo
router.post("/update-photo", upload.single("photo"), async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!req.file) {
    res.status(400).json({ message: "No photo uploaded" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findById(decoded._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Delete old photo if it exists
    if (user.photo && user.photo !== '/uploads/default-avatar.jpg') {
      const oldPhotoPath = path.join(uploadDir, path.basename(user.photo));
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Update user photo path based on environment
    const photoPath = process.env.NODE_ENV === 'production' 
      ? `/uploads/${req.file.filename}`
      : `/uploads/${req.file.filename}`;
    
    user.photo = photoPath;
    await user.save();

    res.json({
      message: "Photo updated successfully",
      photo: user.photo,
    });
  } catch (error) {
    console.error("Error updating photo:", error);
    res.status(500).json({ message: "Failed to update photo" });
  }
});

// Get interns by department head
router.get("/interns/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // First get the department head's info to get their department
    const departmentHead = await User.findById(userId);
    if (!departmentHead) {
      res.status(404).json({ message: "Department head not found" });
      return;
    }

    // Find all interns in the same department (using main department - index 0)
    const interns = await User.find({
      departments: { $in: [departmentHead.departments[0]] },
      role: "Intern",
    }).select("-passwordHash"); // Exclude password from the response

    res.json(interns);
  } catch (err) {
    res.status(500).json({ message: "Error fetching interns", error: err });
  }
});

export default router;
