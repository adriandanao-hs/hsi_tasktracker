import { Document, model, Schema, Types } from "mongoose";

export interface IAnnouncement extends Document {
  user: Types.ObjectId;
  title: string;
  message: string;
  departments: string[];
  createdAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  departments: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export const Announcement = model<IAnnouncement>(
  "Announcement",
  announcementSchema,
  "Announcements"
);
