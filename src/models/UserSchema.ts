import { UserDocument } from "#types/models/User.js";
import mongoose, { Model } from "mongoose";

const userSchema = new mongoose.Schema<UserDocument>({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "A user must have a email"],
    unique: [true, "Email is already taken"],
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    select: false,
  },
  avatar: {
    type: String,
  },
});

export const User: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);
