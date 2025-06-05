import { forgotPassword, getUserInfo, resetPassword } from "../controllers/userController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/", [isAuthenticated], getUserInfo);
userRoutes.post("/forgot-password", forgotPassword);
userRoutes.get("/reset-password", [isAuthenticated], resetPassword);

export default userRoutes;
