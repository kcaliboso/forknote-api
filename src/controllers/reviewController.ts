import { Review } from "../models/ReviewSchema";
import { ReviewDocument } from "../types/models/Review";
import { UserDocument } from "../types/models/User";
import ApiResponse from "../types/responses/ApiResponse";
import { AppErrorClass } from "../utils/appErrorClass";
import { catchAsync } from "../utils/catchAsync";
import type { ParamsDictionary } from "express-serve-static-core";

export const index = catchAsync(async (req, res, next) => {
  const { recipeId } = req.params;

  if (!recipeId) {
    next(new AppErrorClass("Route is inaccessible.", 404));
    return;
  }

  const reviews = await Review.find({
    recipe: recipeId,
  })
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .select("-updatedAt -__v");

  res.status(200).json({
    message: "Reviews",
    status: "success",
    data: reviews,
  });
});

export const show = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "user",
    select: "-__v -passwordChangedAt -createdAt -updatedAt -savedRecipes -role",
  });

  if (!review) {
    next(new AppErrorClass("Review not found", 404));
    return;
  }

  res.status(200).json({
    data: review,
    message: "Review Information",
    status: "success",
  });
});

export const store = catchAsync<ParamsDictionary, ApiResponse<ReviewDocument>, ReviewDocument>(async (req, res, next) => {
  const user = req.user as UserDocument;
  const { recipeId } = req.params;

  if (!recipeId) {
    next(new AppErrorClass("Route is inaccessible.", 404));
    return;
  }

  const review = await Review.create({
    ...req.body,
    user: user._id,
    recipe: recipeId,
  });

  res.status(200).json({
    data: review,
    message: "Review Created",
    status: "success",
  });
});

export const update = catchAsync<ParamsDictionary, ApiResponse<ReviewDocument>, Partial<ReviewDocument>>(async (req, res, _next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    data: review,
    message: "Review Updated",
    status: "success",
  });
});

export const destroy = catchAsync(async (req, res, _next) => {
  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Review Deleted",
    status: "success",
  });
});
