import { UserDocument } from "#types/models/User.js";
import mongoose, { Model } from "mongoose";
import argon2 from "argon2";

const userSchema = new mongoose.Schema<UserDocument>(
  {
    firstName: {
      type: String,
      required: [true, "A user must have a first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "A user must have a last name"],
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
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

// Virual properties (showcase practice)
// these are properties that are computed, and is not part of database
// so we cant use them in queries
// GETTER
userSchema.virtual("fullName").get(function () {
  // we use this keyword here if we need to manipulate existing columns/properties
  return `${this.firstName} ${this.lastName}`;
});

// Document Middleware for MongoDB
// this runs before .save() and .create() (not .insertMany()) to the database
userSchema.pre("save", async function (next) {
  const hashedPassword = await argon2.hash(this.password);
  this.password = hashedPassword;

  next();
});

// Middlewares are pre('<hook>', function()), post('<hook>', function(doc, next)),
// save, init, validate, remove, updateOne, deleteOne are all hooks
// pre and post are the only middleware hooks we have

// Query Middleware
// allows function to run before or after a certain query
// looks like document middleware but find is not a document hook,
// but a query hook
// userSchema.pre("find", function (next) {
//   next();
// });

export const User: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);
