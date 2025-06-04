import { AppErrorClass } from "#utils/appErrorClass.js";
import type { Request, Response, NextFunction } from "express";

import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "#models/UserSchema.js";
import { TokenPayload } from "#types/TokenPayload.js";
import { Role } from "#types/enums/Role.js";

dotenv.config();

if (!process.env.APP_SECRET || !process.env.APP_JWT_EXPIRES_IN) {
  throw new AppErrorClass("APP_SECRET or APP_JWT_EXPIRES_IN is not set.");
}

const APP_SECRET: Secret = process.env.APP_SECRET;

export const isAuthenticated = async (req: Request, _res: Response, next: NextFunction) => {
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
  const user = await User.findById(decoded.id);

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

  // Only allow admins and customers to access the other parts
  // of crud. We can remove this, if all roles can access CRUD.
  // and will create more granular changes on the authorization
  if (user.role === Role.User) {
    next(new AppErrorClass("Forbidden Access", 403));
    return;
  }

  req.user = user;

  next();
};
