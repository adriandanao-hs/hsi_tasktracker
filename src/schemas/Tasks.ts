import { Document, model, Schema, Types } from "mongoose";

export interface ITask extends Document {
  assignedTo: Types.ObjectId;
  role: "Intern" | "Supervisor" | "Department Head";
  taskName: string;
  to: string;
  dayTime: string;
  department: string;
  subject: string;
  details: string;
}

const taskSchema = new Schema<ITask>({
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["Intern", "Supervisor", "Department Head"],
    default: "Intern",
  },
  taskName: { type: String, required: true },
  to: { type: String, required: true },
  dayTime: { type: String, required: true },
  department: { type: String, required: true },
  subject: { type: String, required: true },
  details: { type: String, required: true },
});

export const Task = model<ITask>("Task", taskSchema, "Task");
