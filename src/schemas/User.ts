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
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  photo: { type: String, default: "/uploads/default-avatar.jpg" },
  departments: { 
    type: [String], 
    required: true, 
    validate: {
      validator: function(v: string[]) {
        return Array.isArray(v) && v.length > 0;
      },
      message: "At least one department is required"
    }
  },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["Intern", "Department Head", "Supervisor"],
    default: "Intern",
    required: true
  },
});

export const User = model<IUser>("User", userSchema);
