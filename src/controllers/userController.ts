import { Secret } from "jsonwebtoken";
import { sendMail } from "../config/email";
import { User } from "../models/UserSchema";
import ApiResponse from "../types/responses/ApiResponse";
import { AppErrorClass } from "../utils/appErrorClass";
import { catchAsync } from "../utils/catchAsync";
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { createHashResetToken, jwtSign } from "../utils/authHelpers";
import { UserDocument } from "../types/models/User";

if (!process.env.APP_SECRET || !process.env.APP_JWT_EXPIRES_IN) {
  throw new AppErrorClass("APP_SECRET or APP_JWT_EXPIRES_IN is not set.");
}

const APP_SECRET: Secret = process.env.APP_SECRET;

export const getUserInfo = (req: Request, res: Response) => {
  const { user } = req;

  res.status(200).json({
    status: "success",
    message: "User Information",
    data: user,
  });
};

export const forgotPassword = catchAsync<ParamsDictionary, ApiResponse<null>, { email: string; get: string }>(async (req, res, next) => {
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

  const resetToken = user.createPasswordResetToken();

  console.log(resetToken);

  // Save the user, since we ran user.createPasswordResetToken
  // inside that instance method we have assigned values for
  // passwordResetToken and passwordResetExpires.
  // So saving here, will update the user. validateBeforeSave
  // will disable all required fields in the user document.
  await user.save({ validateBeforeSave: false });

  // 3. Send it to user's email
  // we will redirect the user to the reset password page on react (soon)
  // to create a new password and new passwordConfirmation
  // for now, we will do the request using patch
  try {
    const resetUrl = `${req.protocol}://${process.env.FRONTEND_URL ?? "localhost"}/reset-password?reset-token=${resetToken}`;

    const message = `Forgot your password? Please click on this link: ${resetUrl}. If you didn't request for this, you can't ignore this email.`;

    await sendMail({
      sender: "ForkNote <no-reply@forknote.com>",
      to: user.email,
      subject: "You password reset token (valid for 10 mins)",
      text: message,
    });

    res.status(200).json({
      status: "success",
      message: "Reset token sent to email!",
    });
  } catch (_error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    next(new AppErrorClass("There was an error while sending the email. Try again later.", 500));
    return;
  }
});

export const resetPassword = catchAsync<ParamsDictionary, ApiResponse<UserDocument>, { password: string; passwordConfirmation: string }>(
  async (req, res, next) => {
    // 1. Get user based on the token
    const hashedToken = createHashResetToken(req.params.token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: Date.now(),
      },
    });

    // 2. If token has not expired, and there is user, set the new password
    if (!user) {
      next(new AppErrorClass("Token is invalid or has expired.", 400));
      return;
    }

    user.password = req.body.password;
    user.passwordConfirmation = req.body.passwordConfirmation;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    await user.save();

    // 3. Update changePasswordAt property for user
    // we are going to use pre save hook on userSchema

    // 4. Log the user in, send Jwt
    const token = jwtSign(user, APP_SECRET);

    res.status(200).json({
      status: "success",
      token,
      data: user,
    });
  },
);
