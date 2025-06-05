import { User } from "../models/UserSchema";
import ApiResponse from "../types/responses/ApiResponse";
import { AppErrorClass } from "../utils/appErrorClass";
import { catchAsync } from "../utils/catchAsync";
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

export const getUserInfo = (req: Request, res: Response) => {
  const { user } = req;

  res.status(200).json({
    status: "success",
    message: "User Information",
    data: user,
  });
};

export const forgotPassword = catchAsync<ParamsDictionary, ApiResponse<null>, { email: string }>(async (req, res, next) => {
  const { email } = req.body;

  // 1. Get user based on posted email
  const user = await User.findOne({
    email,
  });

  if (!user) {
    next(new AppErrorClass("Email does not exist.", 404));
    return;
  }
  // 2. Generate the random reset token

  // 3. Send it to user's email
});

export const resetPassword = (req: Request, res: Response) => {
  //
};
