import recipeRoutes from "#routes/recipeRoutes.js";
import { Router } from "express";

const router = Router();

router.use("/api/v1/recipes", recipeRoutes);

export default router;
