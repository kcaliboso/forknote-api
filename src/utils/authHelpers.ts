import { UserDocument } from "../types/models/User";
import jwt from "jsonwebtoken";

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

export const createHashResetToken = (resetToken: string) => {
  return crypto.createHash("sha256").update(resetToken).digest("hex");
};
