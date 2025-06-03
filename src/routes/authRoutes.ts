import { signup } from "#controllers/authController.js";
import { Router } from "express";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const authRoutes = Router();

authRoutes.post("/register", [upload.none()], signup);

export default authRoutes;
