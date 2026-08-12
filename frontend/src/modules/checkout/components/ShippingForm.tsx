"use client";

import { useAuthStore } from "@/stores/useAuthStore";

interface ShippingFormProps {
  onAddressSelect: (id: string) => void;
}

export function ShippingForm({ onAddressSelect }: ShippingFormProps) {
  const user = useAuthStore(state => state.user);

  return (
    <div className="glass p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
      {user ? (
        <div className="flex flex-col gap-4">
          {user.addresses?.map(addr => (
            <label key={addr.id} className="flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:border-brand">
              <input 
                type="radio" 
                name="address" 
                className="mt-1" 
                onChange={() => onAddressSelect(addr.id || "")} 
              />
              <div>
                <p className="font-semibold">{addr.street}</p>
                <p className="text-sm text-zinc-500">{addr.city}, {addr.state} {addr.pincode}</p>
              </div>
            </label>
          ))}
          {!user.addresses?.length && (
            <div className="text-sm text-zinc-500">
              No addresses found. Please add one in your account.
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-zinc-500 mb-4">
          Please login to select shipping address.
        </div>
      )}
    </div>
  );
}
