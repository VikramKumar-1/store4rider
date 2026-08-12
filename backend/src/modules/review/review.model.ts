import mongoose, { Schema } from "mongoose";
import { IReview } from "@store4riders/shared-types";

const reviewSchema = new Schema<IReview>(
  {
    userId: { type: String, required: true },
    productId: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export const ReviewModel = mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);
