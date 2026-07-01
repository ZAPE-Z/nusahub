import { create } from "zustand";

export interface Transaction {
  id: string;
  type: "deposit" | "transfer" | "payment";
  amount: number;
  recipient?: string;
  sender?: string;
  timestamp: string;
  status: "success" | "failed" | "pending";
  note?: string;
}

interface WalletState {
  balance: number;
  transactions: Transaction[];
  getBalance: () => number;
  updateBalance: (newBalance: number) => void;
  addTransaction: (tx: Omit<Transaction, "id" | "timestamp">) => Transaction;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 1000000, // Starting simulated balance: Rp 1.000.000
  transactions: [
    {
      id: "tx-init",
      type: "deposit",
      amount: 1000000,
      sender: "System Init",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString("id-ID"),
      status: "success",
      note: "Initial mock wallet grant",
    },
  ],
  getBalance: () => get().balance,
  updateBalance: (newBalance) => set({ balance: newBalance }),
  addTransaction: (tx) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      timestamp: new Date().toLocaleString("id-ID"),
    };
    set((state) => ({
      transactions: [newTx, ...state.transactions],
    }));
    return newTx;
  },
}));
