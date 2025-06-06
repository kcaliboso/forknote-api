import { signup, login } from "../controllers/authController";
import { Router } from "express";

const authRoutes = Router();

authRoutes.post("/register", signup);
authRoutes.post("/login", login);

export default authRoutes;
