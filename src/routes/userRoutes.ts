import { forgotPassword, getUserInfo, resetPassword, updatePassword } from "../controllers/userController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/", [isAuthenticated], getUserInfo);
userRoutes.post("/forgot-password", forgotPassword);
userRoutes.post("/reset-password/:token", resetPassword);
userRoutes.post("/update-password", [isAuthenticated], updatePassword);

export default userRoutes;
