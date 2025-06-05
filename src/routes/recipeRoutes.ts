import { destroy, getIngredient, getRecipeStats, index, show, store, update } from "../controllers/recipeController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAuthorized } from "../middlewares/isAuthorized";
import { Role } from "../types/enums/Role";
import { Router } from "express";
import { upload } from "../config/multerSetup";

const recipeRoutes = Router();

// recipeRoutes.param("id");

// we can also make use of middlewares to set queries directly
// before it goes inside the handlers/controllers.
// This is a good strategy if our query params are too long already
// and we need to 'alias' that route. for example, /top-5-cheapest-but-best-recipe.
// ?limit=5&sort=price,-ratings&fields=name,ratings,reviews,location
// this is too long to remember, so using aliasing, we can just hit the
// endpoint and we can have the results.

recipeRoutes.route("/stats").get(getRecipeStats);
recipeRoutes.route("/ingredients/:ingredient").get(getIngredient);

recipeRoutes
  .route("/")
  .get(index)
  .post([upload.single("cover"), isAuthenticated, isAuthorized(Role.Admin, Role.Customer)], store);

recipeRoutes
  .route("/:id")
  .get(show)
  .patch([upload.single("cover"), isAuthenticated, isAuthorized(Role.Admin, Role.Customer)], update)
  .delete([isAuthenticated, isAuthorized(Role.Admin, Role.Customer)], destroy);

export default recipeRoutes;

/**
 * TODOs:
 * 1) Validators for request on post, patch and also
 * 2) Auth for post, patch and delete
 */
