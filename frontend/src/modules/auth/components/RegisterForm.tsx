"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type RegisterFormInputs = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema)
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormInputs) => {
      const res = await apiClient.post("/auth/register", data);
      return res.data;
    },
    onSuccess: (data) => {
      login(data.data.user, data.data.token);
      toast.success("Account created successfully!");
      router.push("/account/dashboard");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Registration failed");
    }
  });

  return (
    <form onSubmit={handleSubmit(data => registerMutation.mutate(data))} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          placeholder="John"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          label="Last Name"
          placeholder="Doe"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>
      <Input
        label="Email"
        type="email"
        placeholder="rider@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button 
        type="submit" 
        className="w-full mt-2" 
        isLoading={registerMutation.isPending}
      >
        Create Account
      </Button>
    </form>
  );
}
