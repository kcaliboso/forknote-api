import { Document } from "mongoose";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string | undefined;
  avatar?: string;
}

export interface UserDocument extends User, Document {}
