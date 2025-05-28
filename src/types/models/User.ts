import { Document } from "mongoose";

interface User {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface UserDocument extends User, Document {}
