import React from "react";
import CreatorView from "@/features/creator/components/CreatorView";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

export default function CreatorPage() {
  return (
    <ErrorBoundary>
      <CreatorView />
    </ErrorBoundary>
  );
}
