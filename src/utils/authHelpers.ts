import { UserDocument } from "../types/models/User";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import argon2 from "argon2";
import crypto from "crypto";
import dotenv from "dotenv";
import { AppErrorClass } from "./appErrorClass";

dotenv.config();

if (!process.env.APP_SECRET || !process.env.APP_JWT_EXPIRES_IN) {
  throw new AppErrorClass("APP_SECRET or APP_JWT_EXPIRES_IN is not set.");
}

const appSecret: Secret = process.env.APP_SECRET;
const rawExpiresIn = process.env.APP_JWT_EXPIRES_IN as string | undefined;
const expiresIn = rawExpiresIn ?? "1d";

/**
 * Signs and creates the jwt
 * @param user UserDocument (Mongoose model schema)
 * @param secretSalt string
 * @returns string
 */
export const jwtSign = (user: UserDocument): string => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    appSecret,
    {
      expiresIn,
    } as SignOptions,
  );
};

/**
 * Creates a hashed version of the reset token passed.
 *
 * @param resetToken string
 * @returns string
 */
export const createHashResetToken = (resetToken: string) => {
  return crypto.createHash("sha256").update(resetToken).digest("hex");
};

/**
 * Creates a hashed password to be saved on the database.
 *
 * @param password string
 * @returns string
 */
export const createHashedPassword = async (password: string) => {
  return await argon2.hash(password);
};
