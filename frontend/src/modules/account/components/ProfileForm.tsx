"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@store4riders/shared-validation";
import { z } from "zod";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useState } from "react";

export function ProfileForm() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "", 
    }
  });

  const onSubmit = async (data: z.infer<typeof updateProfileSchema>) => {
    setIsLoading(true);
    try {
      const res = await apiClient.put("/users/me", data);
      setUser(res.data.data);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Profile Details</h1>
      
      <div className="glass p-6 rounded-xl border border-zinc-100 dark:border-zinc-800 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">First Name</label>
              <Input 
                {...register("firstName")} 
                error={errors.firstName?.message as string} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Last Name</label>
              <Input 
                {...register("lastName")} 
                error={errors.lastName?.message as string} 
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email (Cannot be changed)</label>
            <Input 
              value={user?.email || ""} 
              disabled 
              className="bg-zinc-50 dark:bg-zinc-900" 
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Phone Number</label>
            <Input 
              {...register("phone")} 
              error={errors.phone?.message as string} 
            />
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button type="submit" isLoading={isLoading}>Save Changes</Button>
          </div>
        </form>
      </div>
    </>
  );
}
