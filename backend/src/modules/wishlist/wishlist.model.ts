import mongoose, { Schema } from "mongoose";
import { IWishlist } from "@store4riders/shared-types";

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: { type: String, required: true, unique: true },
    productIds: [{ type: String }],
  },
  { timestamps: true }
);

export const WishlistModel = mongoose.models.Wishlist || mongoose.model<IWishlist>("Wishlist", wishlistSchema);
