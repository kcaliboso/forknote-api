import { User } from "#models/UserSchema.js";
import { UserDocument } from "#types/models/User.js";
import ApiResponse from "#types/responses/ApiResponse.js";
import { catchAsync } from "#utils/catchAsync.js";
import type { ParamsDictionary } from "express-serve-static-core";
import { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import { AppErrorClass } from "#utils/appErrorClass.js";
import { jwtSign } from "#utils/authHelpers.js";

dotenv.config();

if (!process.env.APP_SECRET || !process.env.APP_JWT_EXPIRES_IN) {
  throw new AppErrorClass("APP_SECRET or APP_JWT_EXPIRES_IN is not set.");
}

const APP_SECRET: Secret = process.env.APP_SECRET;

export const signup = catchAsync<ParamsDictionary, ApiResponse<UserDocument>, UserDocument>(async (req, res, _next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
  });

  if (!process.env.APP_SECRET || !process.env.APP_JWT_EXPIRES_IN) {
    throw new AppErrorClass("APP_SECRET environment variable is not set.");
  }

  const token = jwtSign(newUser, APP_SECRET);

  res.status(201).json({
    status: "success",
    token,
    data: newUser,
  });
});

export const login = catchAsync<ParamsDictionary, ApiResponse<UserDocument>, Partial<UserDocument>>(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppErrorClass("Please provide email and password", 400));
    return;
  }

  // +password on the select field is needed because since our
  // userSchema has a select: false on the password field
  // using find* methods will not show the password on the result
  // +password will add it back to the result. so be careful,
  // if you send back the user to the json response, the password
  // is already appended.
  const user = await User.findOne({
    email,
  }).select("+password");

  const verifiedPassword = await user?.verifyPassword(user.password, password);

  if (!verifiedPassword || !user) {
    next(new AppErrorClass("Credentials do not match.", 401));
    return;
  }
  const token = jwtSign(user, APP_SECRET);

  res.status(200).json({
    status: "success",
    token,
    data: user,
  });
});
