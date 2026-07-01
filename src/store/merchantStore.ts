import { create } from "zustand";

export interface MerchantProduct {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  stock: number;
}

export interface MerchantOrder {
  id: string;
  customerName: string;
  customerAddress: string;
  productTitle: string;
  quantity: number;
  totalAmount: number;
  status: "pending" | "shipped" | "cancelled";
  timestamp: string;
}

interface MerchantState {
  products: MerchantProduct[];
  orders: MerchantOrder[];
  revenue: number;
  visitors: number;
  addProduct: (product: Omit<MerchantProduct, "id">) => void;
  editProduct: (id: string, product: Partial<MerchantProduct>) => void;
  deleteProduct: (id: string) => void;
  shipOrder: (id: string) => void;
  addOrder: (order: Omit<MerchantOrder, "id" | "status" | "timestamp">) => void;
}

export const useMerchantStore = create<MerchantState>((set) => ({
  products: [
    {
      id: "prod-2",
      title: "Spicy Tempeh Crisps (Box)",
      price: 15000,
      imageUrl: "https://images.unsplash.com/photo-1599490659213-e2b9527bb087?w=200&auto=format&fit=crop&q=60",
      stock: 25,
    },
    {
      id: "prod-3",
      title: "Bandung Brownies (Pack)",
      price: 35000,
      imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&auto=format&fit=crop&q=60",
      stock: 10,
    }
  ],
  orders: [
    {
      id: "ord-1",
      customerName: "Budi Santoso",
      customerAddress: "Jl. Dago No. 12, Bandung",
      productTitle: "Spicy Tempeh Crisps (Box)",
      quantity: 1,
      totalAmount: 15000,
      status: "pending",
      timestamp: "Today, 10:15 AM"
    },
    {
      id: "ord-2",
      customerName: "Andi Wijaya",
      customerAddress: "Kecamatan Coblong, Bandung",
      productTitle: "Bandung Brownies (Pack)",
      quantity: 2,
      totalAmount: 70000,
      status: "shipped",
      timestamp: "Yesterday"
    }
  ],
  revenue: 85000, // Rp 15.000 + Rp 70.000
  visitors: 342,
  addProduct: (product) => set((state) => ({
    products: [...state.products, { ...product, id: `prod-${Date.now()}` }]
  })),
  editProduct: (id, updated) => set((state) => ({
    products: state.products.map((p) => p.id === id ? { ...p, ...updated } : p)
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id)
  })),
  shipOrder: (id) => set((state) => ({
    orders: state.orders.map((o) => o.id === id ? { ...o, status: "shipped" } : o)
  })),
  addOrder: (order) => set((state) => {
    const newOrder: MerchantOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      status: "pending",
      timestamp: "Just now"
    };
    return {
      orders: [newOrder, ...state.orders],
      revenue: state.revenue + order.totalAmount
    };
  })
}));
