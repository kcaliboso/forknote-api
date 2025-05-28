import { checkResource, destroy, index, show, store, update } from "#controllers/recipeController.js";
import { Router } from "express";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const recipeRoutes = Router();

recipeRoutes.param("id", checkResource);

recipeRoutes.route("/").get(index).post([upload.none()], store);

recipeRoutes.route("/:id").get(show).patch([upload.none()], update).delete(destroy);

export default recipeRoutes;

/**
 * TODOs:
 * 1) Validators for request on post, patch and also
 * 2) Auth for post, patch and delete
 */
