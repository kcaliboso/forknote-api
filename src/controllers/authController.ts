import { User } from "../models/UserSchema";
import { UserDocument } from "../types/models/User";
import ApiResponse from "../types/responses/ApiResponse";
import { catchAsync } from "../utils/catchAsync";
import type { ParamsDictionary } from "express-serve-static-core";
import dotenv from "dotenv";
import { AppErrorClass } from "../utils/appErrorClass";
import { jwtSign } from "../utils/authHelpers";

import type { Response } from "express";

dotenv.config();

const rawCookieExpiresIn = process.env.APP_COOKIE_EXPIRES_IN as number | undefined;
const cookieExpiresIn = rawCookieExpiresIn ?? 1;

if (!process.env.APP_SECRET || !process.env.APP_JWT_EXPIRES_IN) {
  throw new AppErrorClass("APP_SECRET or APP_JWT_EXPIRES_IN is not set.");
}

export const signup = catchAsync<ParamsDictionary, ApiResponse<UserDocument>, Partial<UserDocument>>(async (req, res, _next) => {
  const { firstName, lastName, email, password, passwordConfirmation } = req.body;

  const newUser = await User.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    passwordConfirmation: passwordConfirmation,
  });

  if (!process.env.APP_SECRET || !process.env.APP_JWT_EXPIRES_IN) {
    throw new AppErrorClass("APP_SECRET environment variable is not set.");
  }

  createSendToken(newUser, res);
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

  if (!user) {
    next(new AppErrorClass("Credentials do not match.", 401));
    return;
  }

  const verifiedPassword = await user.verifyPassword(user.password, password);

  if (!verifiedPassword) {
    next(new AppErrorClass("Credentials do not match.", 401));
    return;
  }
  createSendToken(user, res);
});

export const createSendToken = (user: UserDocument, res: Response) => {
  const token = jwtSign(user);
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000),
    secure: false, // 'true' only works on https
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    status: "success",
    token,
    data: user,
  });
};
