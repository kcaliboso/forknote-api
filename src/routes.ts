import authRoutes from "#routes/authRoutes.js";
import recipeRoutes from "#routes/recipeRoutes.js";
import { Router } from "express";

const router = Router();

router.use("/api/v1/recipes", recipeRoutes);

router.use("/api/v1/auth", authRoutes);

export default router;
