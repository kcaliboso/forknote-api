import { Review } from "../models/ReviewSchema";
import { UserDocument } from "../types/models/User";
import { AppErrorClass } from "../utils/appErrorClass";
import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";

/**
 * Checks if the resource ID of the review we are
 * updating and deleting is OUR OWN REVIEW
 *
 * @returns
 */
export const isOwnReview = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  const user = req.user as UserDocument;

  const { id } = req.params;

  if (id) {
    const review = await Review.findById(id);
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if (review?.user.toString() !== user.id) {
      next(new AppErrorClass("You don't have access to this resource", 403));
      return;
    }
  }

  next();
});
