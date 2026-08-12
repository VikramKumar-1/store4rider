import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ICartItem } from "@store4riders/shared-types";

export interface LocalCartItem extends ICartItem {
  product?: any;
}

// Temporary offline/guest cart. Syncs with backend when user logs in.
interface CartState {
  items: LocalCartItem[];
  addItem: (item: LocalCartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i === existing ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "guest-cart-storage",
    }
  )
);
