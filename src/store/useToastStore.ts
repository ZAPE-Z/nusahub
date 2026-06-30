import { create } from "zustand";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type: "success" | "error" | "default";
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

export function useToast() {
  const addToast = useToastStore((state) => state.addToast);
  return {
    toast: (title: string, description?: string, type: ToastItem["type"] = "default") => {
      addToast({ title, description, type });
    },
  };
}
