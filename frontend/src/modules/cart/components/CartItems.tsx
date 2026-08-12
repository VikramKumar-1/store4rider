"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { formatPrice } from "@store4riders/shared-utils";

interface CartItemsProps {
  items: any[];
  onUpdate: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartItems({ items, onUpdate, onRemove }: CartItemsProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 glass rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/products" className="text-brand hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {items.map((item) => (
        <div key={item.id} className="flex gap-6 glass p-4 rounded-xl items-center relative">
          <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
            {/* Displaying placeholder logic since we don't fetch product details in store for now */}
            <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">Item</div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Product {item.productId.slice(-6)}</h3>
            <p className="text-brand font-bold">{formatPrice(5000)}</p>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <button 
                  onClick={() => onUpdate(item.id, Math.max(1, item.quantity - 1))}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 font-semibold">{item.quantity}</span>
                <button 
                  onClick={() => onUpdate(item.id, item.quantity + 1)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button 
                onClick={() => onRemove(item.id)}
                className="text-red-500 hover:text-red-600 transition-colors p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
