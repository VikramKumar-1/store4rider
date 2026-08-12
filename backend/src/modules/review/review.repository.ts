import { ReviewModel } from "./review.model";
import { IReview } from "@store4riders/shared-types";

export class ReviewRepository {
  static async create(data: Partial<IReview>): Promise<IReview> {
    const review = new ReviewModel(data);
    return (await review.save()).toObject() as IReview;
  }

  static async findByProductId(productId: string): Promise<IReview[]> {
    return ReviewModel.find({ productId }).sort({ createdAt: -1 }).lean().exec() as unknown as IReview[];
  }

  static async findByUserAndProduct(userId: string, productId: string): Promise<IReview | null> {
    return ReviewModel.findOne({ userId, productId }).lean().exec() as unknown as IReview | null;
  }
}
