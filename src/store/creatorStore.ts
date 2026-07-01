import { create } from "zustand";

export interface DigitalProduct {
  id: string;
  title: string;
  price: number;
  downloadsCount: number;
}

interface CreatorState {
  followersCount: number;
  engagementRate: string;
  revenue: number; // tip revenue and digital item earnings
  digitalProducts: DigitalProduct[];
  addDigitalProduct: (prod: Omit<DigitalProduct, "id" | "downloadsCount">) => void;
  deleteDigitalProduct: (id: string) => void;
  addTip: (amount: number) => void;
}

export const useCreatorStore = create<CreatorState>((set) => ({
  followersCount: 124,
  engagementRate: "8.5%",
  revenue: 25000,
  digitalProducts: [
    { id: "dig-1", title: "Warm Cream Vectors Set", price: 25000, downloadsCount: 1 },
    { id: "dig-2", title: "Minimalist Desktop Wallpapers", price: 10000, downloadsCount: 0 }
  ],
  addDigitalProduct: (prod) => set((state) => ({
    digitalProducts: [...state.digitalProducts, { ...prod, id: `dig-${Date.now()}`, downloadsCount: 0 }]
  })),
  deleteDigitalProduct: (id) => set((state) => ({
    digitalProducts: state.digitalProducts.filter((p) => p.id !== id)
  })),
  addTip: (amount) => set((state) => ({
    revenue: state.revenue + amount
  }))
}));
