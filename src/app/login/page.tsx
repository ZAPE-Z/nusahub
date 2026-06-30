import React from "react";
import LoginForm from "@/features/auth/components/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="font-heading text-xl font-bold text-text-primary">Welcome Back</CardTitle>
          <CardDescription className="text-xs text-text-muted">
            Sign in using your NusaHub credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
