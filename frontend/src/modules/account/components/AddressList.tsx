"use client";

import { useAuthStore } from "@/stores/useAuthStore";

export function AddressList() {
  const { user } = useAuthStore();

  return (
    <>
      <h2 className="text-2xl font-bold mt-4">Saved Addresses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user?.addresses?.map(addr => (
          <div key={addr.id} className="glass p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 flex flex-col gap-1">
            {addr.isDefault && <span className="text-xs text-brand font-bold uppercase mb-2 tracking-wider">Default</span>}
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{addr.street}</p>
            <p className="text-sm text-zinc-500">{addr.city}, {addr.state} {addr.pincode}</p>
            <p className="text-sm text-zinc-500">{addr.country}</p>
          </div>
        ))}
        {/* Placeholder for Add New Address Button */}
        <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-brand hover:text-brand transition-colors text-zinc-400">
          <span className="font-medium">+ Add New Address</span>
        </button>
      </div>
    </>
  );
}
