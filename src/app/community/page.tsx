import React from "react";
import CommunityView from "@/features/community/components/CommunityView";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

export default function CommunityPage() {
  return (
    <ErrorBoundary>
      <CommunityView />
    </ErrorBoundary>
  );
}
