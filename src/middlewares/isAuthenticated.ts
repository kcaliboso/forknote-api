import { AppErrorClass } from "../utils/appErrorClass";
import type { Request, Response, NextFunction } from "express";

import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/UserSchema";
import { TokenPayload } from "../types/TokenPayload";
import { catchAsync } from "../utils/catchAsync";

dotenv.config();

if (!process.env.APP_SECRET || !process.env.APP_JWT_EXPIRES_IN) {
  throw new AppErrorClass("APP_SECRET or APP_JWT_EXPIRES_IN is not set.");
}

const APP_SECRET: Secret = process.env.APP_SECRET;

export const isAuthenticated = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  // Check if the token is there and validate token
  const bearer = req.headers;
  let token;

  // check if there is a Bearer
  if (bearer.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization?.split(" ")[1];
  }

  if (!token) {
    next(new AppErrorClass("Unauthenticated.", 401));
    return;
  }

  // validate token
  const decoded = jwt.verify(token, APP_SECRET) as TokenPayload;

  const user = await User.findById(decoded.id)
    .select("+active")
    .populate([
      {
        path: "ownedRecipes",
        select: "name ingredients -owner ratings",
      },
      {
        path: "savedRecipes",
        select: "name ingredients ratings",
        populate: {
          path: "owner",
          select: "name id email avatar",
        },
      },
      {
        path: "reviews",
        select: "text rating createdAt id",
      },
    ]);

  // check if the user still exist, because sometimes the user might be
  // deleted for some reason and if you have the jwt yet, you can't use that
  if (!user) {
    next(new AppErrorClass("The user of this token no longer exist", 401));
    return;
  }

  // check if the user changed their password
  if (user.changedPasswordAfter(decoded.iat)) {
    next(new AppErrorClass("User recently changed password. Please login again.", 401));
    return;
  }

  // is user is not active anymore
  if (!user.active) {
    next(new AppErrorClass("User account is deleted", 404));
    return;
  }

  req.user = user;

  next();
});
