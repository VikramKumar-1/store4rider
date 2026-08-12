import { NextRequest } from "next/server";
import { CartService } from "./cart.service";
import { ApiResponse } from "../../core/response/ApiResponse";
import { extractUserFromAuth } from "../../core/middlewares/auth";
import { cartItemSchema } from "@store4riders/shared-validation";
import { ICartItem } from "@store4riders/shared-types";

export class CartController {
  static async get(req: NextRequest) {
    const userId = extractUserFromAuth(req);
    const cart = await CartService.getCart(userId);
    return ApiResponse.success(cart);
  }

  static async addItem(req: NextRequest) {
    const userId = extractUserFromAuth(req);
    const body = await req.json();
    const validatedData = cartItemSchema.parse(body) as ICartItem;
    const cart = await CartService.addItem(userId, validatedData);
    return ApiResponse.success(cart, "Item added to cart");
  }
}
