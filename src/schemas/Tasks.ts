import { Document, model, Schema, Types } from "mongoose";

export interface ITask extends Document {
  taskName: string;
  dayTime: Date;
  department: string;
  subject: string;
  details: string;
  status: "pending" | "in-progress" | "completed";
  statusLog: Array<{
    userId: Types.ObjectId;
    userName: string;
    status: "pending" | "in-progress" | "completed";
    proofOfCompletion?: {
      type: "file";
      value: string;
    };
    updatedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  deleted?: boolean;
  deletedAt?: Date;
}

const taskSchema = new Schema<ITask>(
  {
    taskName: { type: String, required: true },
    dayTime: { type: Date, required: true },
    department: { type: String, required: true },
    subject: { type: String, required: true },
    details: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    statusLog: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        userName: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "in-progress", "completed"],
          required: true,
        },
        proofOfCompletion: {
          type: {
            type: String,
            enum: ["file"],
          },
          value: String,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const Task = model<ITask>("Task", taskSchema, "Task");
