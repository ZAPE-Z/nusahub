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

const registerSchema = z.object({
  name: z.string().min(2, "Full Name must be at least 2 characters long"),
  handle: z.string().min(3, "Unique Handle must be at least 3 characters long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { register: signup, isRegistering, registerError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      handle: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await signup({
        name: values.name,
        handle: values.handle,
        email: values.email,
      });
      toast("Success", "Account created successfully! Welcome.", "success");
      router.push("/home");
    } catch (err: any) {
      toast("Error", err.message || "Failed to create account", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-text-muted">Full Name</label>
        <Input
          type="text"
          placeholder="e.g. Budi Santoso"
          {...register("name")}
          className={errors.name ? "border-error focus-visible:ring-error" : ""}
        />
        {errors.name && <span className="text-xs text-error">{errors.name.message}</span>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-text-muted">Unique Handle</label>
        <Input
          type="text"
          placeholder="e.g. budis"
          {...register("handle")}
          className={errors.handle ? "border-error focus-visible:ring-error" : ""}
        />
        {errors.handle && <span className="text-xs text-error">{errors.handle.message}</span>}
      </div>

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
        <Link href="/login" className="text-text-muted hover:underline">
          Back to Login
        </Link>
      </div>

      {registerError && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-md text-center">
          <span className="text-xs text-error font-medium">{registerError}</span>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isRegistering}>
        {isRegistering ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
