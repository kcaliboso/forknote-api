import authRoutes from "./routes/authRoutes";
import recipeRoutes from "./routes/recipeRoutes";
import userRoutes from "./routes/userRoutes";
import { Router } from "express";

const router = Router();

router.use("/api/v1/recipes", recipeRoutes);

router.use("/api/v1/auth", authRoutes);

router.use("/api/v1/user", userRoutes);

export default router;
