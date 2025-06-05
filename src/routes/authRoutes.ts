import { signup, login } from "../controllers/authController";
import { Router } from "express";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const authRoutes = Router();

authRoutes.post("/register", [upload.none()], signup);
authRoutes.post("/login", [upload.none()], login);

export default authRoutes;
