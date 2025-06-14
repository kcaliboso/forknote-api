import { sendMail } from "../config/email";
import { User } from "../models/UserSchema";
import ApiResponse from "../types/responses/ApiResponse";
import { AppErrorClass } from "../utils/appErrorClass";
import { catchAsync } from "../utils/catchAsync";
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { createHashResetToken, jwtSign } from "../utils/authHelpers";
import { UserDocument } from "../types/models/User";
import { filterReqBody } from "../utils/filterReqBody";

export const getUserInfo = (req: Request, res: Response) => {
  const { user } = req;

  res.status(200).json({
    status: "success",
    message: "User Information",
    data: user,
  });
};

export const forgotPassword = catchAsync<null, ApiResponse<null>, { email: string; get: string }>(async (req, res, next) => {
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
    const token = jwtSign(user);

    res.status(200).json({
      status: "success",
      token,
      data: user,
    });
  },
);

export const updatePassword = catchAsync<
  ParamsDictionary,
  ApiResponse<UserDocument>,
  { currentPassword: string; password: string; passwordConfirmation: string }
>(async (req, res, next) => {
  const user = req.user as UserDocument;

  const currentUser = await User.findById(user.id).select("+password");

  if (!currentUser) {
    next(new AppErrorClass("User cannot be found.", 400));
    return;
  }

  const verifiedPassword = await user.verifyPassword(currentUser.password, req.body.currentPassword);

  if (!verifiedPassword) {
    next(new AppErrorClass("Password is incorrect. Please try again.", 400));
    return;
  }

  currentUser.password = req.body.password;
  currentUser.passwordConfirmation = req.body.passwordConfirmation;
  await currentUser.save();

  const token = jwtSign(user);

  res.status(200).json({
    status: "success",
    token,
    data: currentUser,
  });
});

export const updateUser = catchAsync<ParamsDictionary, ApiResponse<UserDocument>, Partial<UserDocument>>(async (req, res, _next) => {
  const user = req.user as UserDocument;

  // 1. filter and only get the fields that we can update
  const filteredReq = filterReqBody(req.body, ["firstName", "lastName", "avatar"]);

  // 2. update user document
  const updatedUser = await User.findByIdAndUpdate(
    user.id,
    {
      ...filteredReq,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: "success",
    message: "User Information Updated",
    data: updatedUser,
  });
});

export const deleteCurrentUser = catchAsync<ParamsDictionary, ApiResponse<null>, null>(async (req, res, _next) => {
  const user = req.user as UserDocument;

  await User.findByIdAndUpdate(user.id, {
    active: false,
  });

  res.status(204).json({
    status: "success",
    message: "User Account Deleted",
    data: null,
  });
});
