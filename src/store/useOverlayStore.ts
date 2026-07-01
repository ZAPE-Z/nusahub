import React from "react";
import { create } from "zustand";

export type OverlayType = "bottom-sheet" | "dialog" | "custom";

export interface OverlayConfig {
  id: string;
  type: OverlayType;
  componentId: string;
  props?: any;
  isOpen: boolean;
}

interface OverlayState {
  overlays: OverlayConfig[];
  openOverlay: (id: string, type: OverlayType, componentId: string, props?: any) => void;
  closeOverlay: (id: string) => void;
  removeOverlay: (id: string) => void;
  closeAll: () => void;
}

export const useOverlayStore = create<OverlayState>((set) => ({
  overlays: [],
  openOverlay: (id, type, componentId, props = {}) =>
    set((state) => {
      const existing = state.overlays.find((o) => o.id === id);
      if (existing) {
        return {
          overlays: state.overlays.map((o) =>
            o.id === id ? { ...o, isOpen: true, props: { ...o.props, ...props } } : o
          ),
        };
      }
      return {
        overlays: [...state.overlays, { id, type, componentId, props, isOpen: true }],
      };
    }),
  closeOverlay: (id) =>
    set((state) => ({
      overlays: state.overlays.map((o) => (o.id === id ? { ...o, isOpen: false } : o)),
    })),
  removeOverlay: (id) =>
    set((state) => ({
      overlays: state.overlays.filter((o) => o.id !== id),
    })),
  closeAll: () =>
    set((state) => ({
      overlays: state.overlays.map((o) => ({ ...o, isOpen: false })),
    })),
}));

// Convenient hooks
export function useOverlay() {
  const { openOverlay, closeOverlay, closeAll } = useOverlayStore();
  
  return {
    open: (id: string, type: OverlayType, componentId: string, props?: any) => {
      openOverlay(id, type, componentId, props);
    },
    close: (id: string) => {
      closeOverlay(id);
    },
    closeAll,
  };
}
