"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "@/store/useToastStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, isLoggingIn, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login({ email: values.email });
      toast("Success", "Welcome back to NusaHub!", "success");
      router.push("/home");
    } catch (err: any) {
      toast("Error", err.message || "Failed to sign in", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-text-muted">Email Address</label>
        <Input
          type="email"
          placeholder="e.g. budi@nusahub.com"
          {...register("email")}
          className={errors.email ? "border-error focus-visible:ring-error" : ""}
        />
        {errors.email && <span className="text-xs text-error">{errors.email.message}</span>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-text-muted">Password</label>
        <Input
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className={errors.password ? "border-error focus-visible:ring-error" : ""}
        />
        {errors.password && <span className="text-xs text-error">{errors.password.message}</span>}
      </div>

      <div className="flex justify-between items-center text-xs">
        <Link href="/forgot-password" className="text-secondary hover:underline">
          Forgot Password?
        </Link>
        <Link href="/register" className="text-primary font-semibold hover:underline">
          Create Account
        </Link>
      </div>

      {loginError && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-md text-center">
          <span className="text-xs text-error font-medium">{loginError}</span>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoggingIn}>
        {isLoggingIn ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
