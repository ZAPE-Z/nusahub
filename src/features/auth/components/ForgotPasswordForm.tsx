"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "@/store/useToastStore";
import Link from "next/link";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordForm() {
  const { toast } = useToast();
  const { resetPassword, isResetting, resetError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotFormValues) => {
    try {
      await resetPassword({ email: values.email });
      toast("Success", "Reset link dispatched to your email address!", "success");
    } catch (err: any) {
      toast("Error", err.message || "Failed to trigger reset", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <p className="text-xs text-text-muted leading-relaxed text-center">
        Enter your registered email and we will send you a mock verification link to restore password access.
      </p>

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

      <div className="flex justify-between items-center text-xs">
        <Link href="/login" className="text-text-muted hover:underline">
          Back to Login
        </Link>
      </div>

      {resetError && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-md text-center">
          <span className="text-xs text-error font-medium">{resetError}</span>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isResetting}>
        {isResetting ? "Sending Link..." : "Send Reset Link"}
      </Button>
    </form>
  );
}
