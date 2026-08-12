import { NextRequest } from "next/server";
import { ReviewService } from "./review.service";
import { ApiResponse } from "../../core/response/ApiResponse";
import { extractUserFromAuth } from "../../core/middlewares/auth";
import { createReviewSchema } from "@store4riders/shared-validation";

export class ReviewController {
  static async create(req: NextRequest) {
    const userId = extractUserFromAuth(req);
    const body = await req.json();
    const validatedData = createReviewSchema.parse(body);

    const review = await ReviewService.addReview(userId, validatedData);
    return ApiResponse.success(review, "Review added successfully", 201);
  }

  static async getByProduct(req: NextRequest, productId: string) {
    const reviews = await ReviewService.getProductReviews(productId);
    return ApiResponse.success(reviews);
  }
}
