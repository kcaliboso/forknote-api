import { Role } from "../enums/Role";
import { Document } from "mongoose";
import { Recipe } from "./Recipe";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string | undefined;
  avatar?: string;
  role: Role;
  passwordChangedAt?: Date;
  savedRecipes?: Recipe[];
}

interface UserMethods {
  verifyPassword(userHashedPassword: string, inputPassword: string): Promise<boolean>;
  changedPasswordAfter(tokenTimestamp: number): boolean;
}

export interface UserDocument extends User, Document, UserMethods {}
