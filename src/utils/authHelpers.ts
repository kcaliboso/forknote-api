import { UserDocument } from "../types/models/User";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import crypto from "crypto";

/**
 * Signs and creates the jwt
 * @param user UserDocument (Mongoose model schema)
 * @param secretSalt string
 * @returns string
 */
export const jwtSign = (user: UserDocument, secretSalt: string): string => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    secretSalt,
    {
      expiresIn: "1d",
    },
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
