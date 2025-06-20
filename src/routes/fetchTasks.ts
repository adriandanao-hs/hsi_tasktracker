import { Router } from "express";
import { Task } from "../schemas/Tasks";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const role = req.query.role as string;
    const actions = await Task.find({ role });
    res.json(actions);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
    return;
  }
});

export default router;
