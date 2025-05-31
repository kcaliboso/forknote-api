import { Document } from "mongoose";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface UserDocument extends User, Document {}
