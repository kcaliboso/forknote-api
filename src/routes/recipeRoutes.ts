import { destroy, getIngredient, getRecipeStats, index, show, store, update } from "../controllers/recipeController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAuthorized } from "../middlewares/isAuthorized";
import { Role } from "../types/enums/Role";
import { Router } from "express";
import { upload } from "../config/multerSetup";
import reviewRoutes from "./reviewRoutes";
import { resizePhotos } from "../middlewares/resizePhotos";

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
  .post([upload.single("cover"), resizePhotos, isAuthenticated, isAuthorized(Role.Admin, Role.Customer)], store);

recipeRoutes
  .route("/:id")
  .get(show)
  .patch([upload.single("cover"), resizePhotos, isAuthenticated, isAuthorized(Role.Admin, Role.Customer)], update)
  .delete([isAuthenticated, isAuthorized(Role.Admin, Role.Customer)], destroy);

recipeRoutes.use("/:recipeId/reviews", reviewRoutes);

export default recipeRoutes;

// example for nested route
// ! You can also just import the reviewRoutes here and do:
// recipeRoutes.use("/:id/reviews", reviewRoutes)
// ! and inside reviewRoutes on the Router(), we do Router({mergeParams: true})
// recipeRoutes.route("/:id/reviews").post(reviewController.store).get("/:id", reviewController.show);

// NOTES
// Nested routes works just like Laravel
// /<parent>/<parent_id>/<child_handler>
// example: /tour/1234/reviews POST (will create reviews on tour)
// /tour/1234/reviews/4321 GET (will get the review 4321 on tour 123)
