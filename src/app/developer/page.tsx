import React from "react";
import DeveloperView from "@/features/developer/components/DeveloperView";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

export default function DeveloperPage() {
  return (
    <ErrorBoundary>
      <DeveloperView />
    </ErrorBoundary>
  );
}
