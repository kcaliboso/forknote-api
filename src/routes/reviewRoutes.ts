import { Router } from "express";
import { index, show, store, update, destroy } from "../controllers/reviewController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isOwnReview } from "../middlewares/isOwnReview";
import { isAlreadyReviewed } from "../middlewares/isAlreadyReviewed";

const reviewRoutes = Router({ mergeParams: true });

reviewRoutes.route("/").get([isAuthenticated], index).post([isAuthenticated, isAlreadyReviewed], store);

reviewRoutes.route("/:id").get([isAuthenticated], show).patch([isAuthenticated, isOwnReview], update).delete([isAuthenticated, isOwnReview], destroy);

export default reviewRoutes;
