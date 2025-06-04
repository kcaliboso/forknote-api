import { Role } from "#types/enums/Role.js";
import { Document } from "mongoose";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string | undefined;
  avatar?: string;
  role: Role;
  passwordChangedAt?: Date;
}

interface UserMethods {
  verifyPassword(userHashedPassword: string, inputPassword: string): Promise<boolean>;
  changedPasswordAfter(tokenTimestamp: number): boolean;
}

export interface UserDocument extends User, Document, UserMethods {}
