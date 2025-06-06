import { UserDocument } from "../types/models/User";
import mongoose, { Model } from "mongoose";
import argon2 from "argon2";
import isEmail from "validator/lib/isEmail";
import { Role } from "../types/enums/Role";
import crypto from "crypto";
import { createHashedPassword, createHashResetToken } from "../utils/authHelpers";

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
      validate: {
        validator: (value: string) => isEmail(value),
        message: "Please enter a valid email",
      },
    },
    role: {
      type: String,
      enum: Role,
      default: Role.User,
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
      select: false,
      minlength: [8, "Password must be 8 or more characters."],
    },
    passwordConfirmation: {
      type: String,
      required: [true, "A user must have a password"],
      validate: {
        validator: function (value: string) {
          return value === this.password;
        },
        message: "Password confirmation does not match.",
      },
    },
    avatar: {
      type: String,
    },
    passwordChangedAt: Date,
    savedRecipes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform(doc, ret) {
        delete ret._id;
        return ret;
      },
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

// making virtuals for ownedRecipes
userSchema.virtual("ownedRecipes", {
  ref: "Recipe",
  localField: "_id",
  foreignField: "owner",
});

// Document Middleware for MongoDB
// this runs before .save() and .create() (not .insertMany()) to the database
userSchema.pre("save", async function (this: UserDocument, next) {
  // this will check if the password did not change
  // if it didn't change it will return nothing.
  // we checked it here for updating a user, if they only
  // changed the other information, then we don't create another
  // hashedpassword
  if (!this.isModified("password")) {
    next();
    return;
  }

  this.password = await createHashedPassword(this.password);
  this.passwordConfirmation = undefined;
  next();
});

// Update the passwordChangedAt property of User
userSchema.pre("save", function (this: UserDocument, next) {
  // if the password of the user did not change
  // or if the user is new. we don't do anything
  if (!this.isModified("password") || this.isNew) {
    next();
  }

  //else
  // the - 1000 will ensure that the passwordChangedAt will
  // be past the date we issued a new json token
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

// Instance method
// This will verify that our password is the same as the input password
// from the forms
userSchema.methods.verifyPassword = async function (userHashedPassword: string, inputPassword: string): Promise<boolean> {
  // this.password will not be available since we have select: false
  return await argon2.verify(userHashedPassword, inputPassword);
};

userSchema.methods.changedPasswordAfter = function (this: UserDocument, tokenTimestamp: number) {
  if (this.passwordChangedAt) {
    const convert = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
    return tokenTimestamp < convert;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function (this: UserDocument) {
  // create a random hex string
  const resetToken = crypto.randomBytes(32).toString("hex");

  // hash the random hex string
  this.passwordResetToken = createHashResetToken(resetToken);

  // creates 10 minutes of validity on the reset token
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

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
