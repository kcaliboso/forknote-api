import { UserDocument } from "../types/models/User";
import { AppErrorClass } from "../utils/appErrorClass";
import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { Recipe } from "../models/RecipeSchema";

/**
 * Checks if the resource ID of the review we are
 * updating and deleting is OUR OWN REVIEW
 *
 * @returns
 */
export const isAlreadyReviewed = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  const user = req.user as UserDocument;

  const { recipeId } = req.params;

  if (recipeId) {
    const recipe = await Recipe.findById(recipeId).populate("reviews");

    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if ((recipe?.reviews ?? []).some((review) => review.user.toString() === user.id)) {
      next(new AppErrorClass("You already left a review on this recipe.", 400));
    }
  }

  next();
});
