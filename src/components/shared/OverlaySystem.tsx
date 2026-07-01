"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useOverlayStore } from "@/store/useOverlayStore";
import ConfirmationDialog from "./ConfirmationDialog";
import BottomSheet from "./BottomSheet";

// Centralized registry map of dynamic components
const OVERLAY_REGISTRY: Record<string, React.ComponentType<any>> = {
  ConfirmationDialog,
  BottomSheet,
};

export default function OverlaySystem() {
  const [mounted, setMounted] = useState(false);
  const { overlays, closeOverlay, removeOverlay } = useOverlayStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {overlays.map((overlay) => {
        if (!overlay.isOpen) return null;

        const Component = OVERLAY_REGISTRY[overlay.componentId];
        if (!Component) {
          console.warn(`Overlay component "${overlay.componentId}" not registered.`);
          return null;
        }
        
        return (
          <Component
            key={overlay.id}
            isOpen={overlay.isOpen}
            onClose={() => closeOverlay(overlay.id)}
            // Call remove overlay after transition runs to clean up memory
            onDestroy={() => removeOverlay(overlay.id)}
            {...overlay.props}
          />
        );
      })}
    </AnimatePresence>
  );
}
