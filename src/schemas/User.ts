import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: "Intern" | "Supervisor" | "Department Head";
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
        type: String,
        enum: ["Intern", "Department Head", "Supervisor"],
        default: "Intern",
    },
});

export const User = model<IUser>("User", userSchema);