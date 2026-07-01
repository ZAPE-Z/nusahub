import React from "react";
import WalletView from "@/features/wallet/components/WalletView";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

export default function WalletPage() {
  return (
    <ErrorBoundary>
      <WalletView />
    </ErrorBoundary>
  );
}
