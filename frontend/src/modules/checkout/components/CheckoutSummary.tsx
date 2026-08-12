"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthStore } from "@/stores/useAuthStore";
import Button from "@/components/ui/Button";
import { formatPrice } from "@store4riders/shared-utils";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface CheckoutSummaryProps {
  selectedAddressId: string;
}

export function CheckoutSummary({ selectedAddressId }: CheckoutSummaryProps) {
  const router = useRouter();
  const cartItems = useCartStore(state => state.items);
  const clearCart = useCartStore(state => state.clearCart);
  const user = useAuthStore(state => state.user);
  
  const [isLoading, setIsLoading] = useState(false);

  const cartTotal = cartItems.reduce((total, item) => total + (item.quantity * 5000), 0); // Mock pricing for now

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please login to checkout");
      router.push("/login");
      return;
    }
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await apiClient.post("/orders", { shippingAddressId: selectedAddressId });
      const { razorpayOrderId, amount } = data.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "mock_key",
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "Store4Riders",
        description: "Premium Motorcycle Gear",
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            await apiClient.post("/orders/verify", {
              razorpayOrderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            clearCart();
            toast.success("Payment successful! Order placed.");
            router.push("/account/orders");
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user.firstName + " " + user.lastName,
          email: user.email,
        },
        theme: {
          color: "#AB1509",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to initialize payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass p-6 rounded-xl h-fit">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="flex flex-col gap-2 mb-6 text-sm">
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between">
            <span>Item {item.productId} x {item.quantity}</span>
            <span>{formatPrice(5000 * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex justify-between mb-6">
        <span className="font-bold">Total</span>
        <span className="font-bold text-brand text-xl">{formatPrice(cartTotal)}</span>
      </div>
      
      <Button 
        size="lg" 
        className="w-full" 
        onClick={handlePayment} 
        isLoading={isLoading}
      >
        Pay Now
      </Button>
      <div className="mt-4 text-center text-xs text-zinc-500 flex justify-center items-center gap-1">
        Secured by <strong>Razorpay</strong>
      </div>
    </div>
  );
}
