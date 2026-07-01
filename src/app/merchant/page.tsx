import React from "react";
import MerchantView from "@/features/merchant/components/MerchantView";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

export default function MerchantPage() {
  return (
    <ErrorBoundary>
      <MerchantView />
    </ErrorBoundary>
  );
}
