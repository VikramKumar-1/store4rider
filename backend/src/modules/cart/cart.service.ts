import { CartRepository } from "./cart.repository";
import { ProductRepository } from "../product/product.repository";
import { ICart, ICartItem } from "@store4riders/shared-types";
import { calculateTax } from "@store4riders/shared-utils";

export class CartService {
  static async getCart(userId: string): Promise<ICart> {
    let cart = await CartRepository.findByUserId(userId);
    if (!cart) {
      cart = await CartRepository.upsert(userId, { items: [], summary: { subtotal: 0, tax: 0, shipping: 0, total: 0 } });
    }
    return this.recalculateSummary(cart);
  }

  static async addItem(userId: string, item: ICartItem): Promise<ICart> {
    const cart = await this.getCart(userId);
    
    // Check if item exists in cart
    const existingIndex = cart.items.findIndex(i => i.productId === item.productId && i.variantId === item.variantId);
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += item.quantity;
    } else {
      // Must generate an ID for the item (in a real app, use UUID)
      item.id = crypto.randomUUID();
      cart.items.push(item);
    }

    const updatedCart = await this.recalculateSummary(cart);
    return await CartRepository.upsert(userId, updatedCart);
  }

  static async recalculateSummary(cart: ICart): Promise<ICart> {
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await ProductRepository.findById(item.productId);
      if (product) {
        let price = product.basePrice;
        if (item.variantId) {
          const variant = product.variants.find(v => v.id === item.variantId);
          if (variant) price = variant.price;
        }
        subtotal += price * item.quantity;
      }
    }

    const tax = calculateTax(subtotal, 18); // 18% GST
    const shipping = subtotal > 0 && subtotal < 999 ? 49 : 0; // Free above 999
    const total = subtotal + tax + shipping;

    cart.summary = { subtotal, tax, shipping, total };
    return cart;
  }
}
