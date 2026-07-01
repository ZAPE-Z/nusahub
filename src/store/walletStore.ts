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
  availableBalance: number;
  spendingThisMonth: number;
  incomeThisMonth: number;
  transactions: Transaction[];
  getBalance: () => number;
  updateBalance: (newBalance: number) => void;
  addTransaction: (tx: Omit<Transaction, "id" | "timestamp">) => Transaction;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 1000000,
  availableBalance: 1000000,
  spendingThisMonth: 185000,
  incomeThisMonth: 500000,
  transactions: [
    {
      id: "tx-init",
      type: "deposit",
      amount: 1000000,
      sender: "System Grant",
      timestamp: "01/07/2026, 09:00",
      status: "success",
      note: "Initial mock wallet grant",
    },
    {
      id: "tx-2",
      type: "payment",
      amount: 15000,
      recipient: "Spicy Tempeh Crisps (Box)",
      timestamp: "01/07/2026, 10:15",
      status: "success",
      note: "Checkout Spicy Tempeh via Chat Commerce",
    },
    {
      id: "tx-3",
      type: "transfer",
      amount: 70000,
      recipient: "Andi Wijaya",
      timestamp: "30/06/2026, 14:22",
      status: "success",
      note: "Design Asset tip vectors",
    },
    {
      id: "tx-4",
      type: "deposit",
      amount: 500000,
      sender: "Budi Santoso",
      timestamp: "28/06/2026, 11:00",
      status: "success",
      note: "Simulated Wallet Top-Up Deposit",
    }
  ],
  getBalance: () => get().balance,
  updateBalance: (newBalance) => set((state) => ({
    balance: newBalance,
    availableBalance: newBalance,
    spendingThisMonth: newBalance < state.balance ? state.spendingThisMonth + (state.balance - newBalance) : state.spendingThisMonth,
    incomeThisMonth: newBalance > state.balance ? state.incomeThisMonth + (newBalance - state.balance) : state.incomeThisMonth,
  })),
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
