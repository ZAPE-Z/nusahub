import React from "react";
import RegisterForm from "@/features/auth/components/RegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="font-heading text-xl font-bold text-text-primary">Create Account</CardTitle>
          <CardDescription className="text-xs text-text-muted">
            Register a new secure profile on NusaHub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
