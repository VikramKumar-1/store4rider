import { NextRequest, NextResponse } from "next/server";
import { WishlistService } from "./wishlist.service";
import { ApiResponse } from "../../core/response/ApiResponse";
import { extractUserFromAuth } from "../../core/middlewares/auth";

export class WishlistController {
  static async get(req: NextRequest) {
    const userId = extractUserFromAuth(req);
    const wishlist = await WishlistService.getWishlist(userId);
    return ApiResponse.success(wishlist);
  }

  static async toggle(req: NextRequest) {
    const userId = extractUserFromAuth(req);
    const body = await req.json();
    const { productId } = body;
    const wishlist = await WishlistService.toggleProduct(userId, productId);
    return ApiResponse.success(wishlist, "Wishlist updated");
  }
}
