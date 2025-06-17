import { signup, login, logout } from "../controllers/authController";
import { Router } from "express";

const authRoutes = Router();

authRoutes.post("/register", signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

export default authRoutes;
