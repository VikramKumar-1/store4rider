"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { User, Package, Heart, LogOut } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

const links = [
  { name: "Profile", path: "/account", icon: User },
  { name: "Orders", path: "/account/orders", icon: Package },
  { name: "Wishlist", path: "/account/wishlist", icon: Heart },
];

export function AccountSidebar() {
  const { user, isAuthenticated, setUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  if (!isAuthenticated || !user) return null;

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="glass rounded-xl p-6 flex flex-col gap-2">
        <div className="mb-6">
          <h2 className="text-xl font-bold">My Account</h2>
          <p className="text-sm text-zinc-500">{user.firstName} {user.lastName}</p>
        </div>
        
        <nav className="flex flex-col gap-2">
          {links.map(link => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.name} 
                href={link.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  isActive ? "bg-brand text-white font-medium shadow-sm" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                }`}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            );
          })}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors mt-4"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
}
