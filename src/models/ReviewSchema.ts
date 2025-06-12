import mongoose, { Model } from "mongoose";
import { ReviewDocument } from "../types/models/Review";

const reviewSchema = new mongoose.Schema<ReviewDocument>(
  {
    text: {
      type: String,
      required: [true, "A rate must have a rating text."],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "A rate must have a rating number from 1 - 5"],
      validate: {
        validator: (rating: number) => rating >= 1 && rating <= 5,
        message: "Rating value should be from 1 (being the lowest) to 5",
      },
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    recipe: {
      type: mongoose.Types.ObjectId,
      ref: "Recipe",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret._id;
        return ret;
      },
    },
  },
);

export const Review: Model<ReviewDocument> = mongoose.model<ReviewDocument>("Review", reviewSchema);
