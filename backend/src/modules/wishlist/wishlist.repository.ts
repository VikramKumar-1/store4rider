import { WishlistModel } from "./wishlist.model";
import { IWishlist } from "@store4riders/shared-types";

export class WishlistRepository {
  static async findByUserId(userId: string): Promise<IWishlist | null> {
    return WishlistModel.findOne({ userId }).lean().exec() as unknown as IWishlist | null;
  }

  static async upsert(userId: string, productIds: string[]): Promise<IWishlist> {
    return WishlistModel.findOneAndUpdate(
      { userId },
      { $set: { productIds } },
      { new: true, upsert: true }
    ).lean().exec() as unknown as IWishlist;
  }
}
