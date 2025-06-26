import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  photo: string;
  departments: string[]; // Array of departments, index 0 is the main department
  passwordHash: string;
  role: "Intern" | "Supervisor" | "Department Head";
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photo: { type: String, default: "" },
  departments: { type: [String], required: true, minlength: 1 }, // At least one department required
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["Intern", "Department Head", "Supervisor"],
    default: "Intern",
  },
});

export const User = model<IUser>("User", userSchema);
