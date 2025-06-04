import { signup, login, getUserInfo } from "#controllers/authController.js";
import { isAuthenticated } from "#middlewares/isAuthenticated.js";
import { Router } from "express";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const authRoutes = Router();

authRoutes.post("/register", [upload.none()], signup);
authRoutes.post("/login", [upload.none()], login);
authRoutes.get("/user", [isAuthenticated], getUserInfo);

export default authRoutes;
