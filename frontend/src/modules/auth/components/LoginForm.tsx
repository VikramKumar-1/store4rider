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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type LoginFormInputs = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema)
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormInputs) => {
      const res = await apiClient.post("/auth/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      login(data.data.user, data.data.token);
      toast.success("Welcome back!");
      router.push("/account/dashboard");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Login failed");
    }
  });

  return (
    <form onSubmit={handleSubmit(data => loginMutation.mutate(data))} className="flex flex-col gap-4">
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
        isLoading={loginMutation.isPending}
      >
        Sign In
      </Button>
    </form>
  );
}
