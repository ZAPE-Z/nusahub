"use client";

import React from "react";
import AIChatView from "@/features/ai/components/AIChatView";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

export default function AIPage() {
  return (
    <ErrorBoundary>
      <AIChatView />
    </ErrorBoundary>
  );
}
