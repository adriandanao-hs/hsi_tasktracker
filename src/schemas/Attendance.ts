import { Document, model, Schema, Types } from "mongoose";

export interface IAttendance extends Document {
  userId: Types.ObjectId;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  notes?: string;
}

const AttendanceSchema = new Schema<IAttendance>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  notes: { type: String },
});

export default model<IAttendance>("Attendance", AttendanceSchema);
