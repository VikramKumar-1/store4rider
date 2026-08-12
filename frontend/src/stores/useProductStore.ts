import { create } from "zustand";

interface ProductStore {
  products: any[];
  isFetched: boolean;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isFetched: false,
  
  fetchProducts: async () => {
    // Prevent refetching if already fetched
    if (get().isFetched) return;
    
    try {
      // Fetch a generous chunk for local filtering (since API parses CSV quickly)
      const res = await fetch("/api/catalog?limit=100");
      const data = await res.json();
      if (data.products) {
        set({ products: data.products, isFetched: true });
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  },
}));
