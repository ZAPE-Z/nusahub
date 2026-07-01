import { create } from "zustand";

export interface AIMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

interface AIState {
  messages: AIMessage[];
  isTyping: boolean;
  addMessage: (msg: Omit<AIMessage, "id" | "timestamp">) => void;
  setTyping: (isTyping: boolean) => void;
  clearHistory: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  messages: [
    {
      id: "ai-init",
      sender: "ai",
      text: "### 🤖 Halo, Budi!\n\nI am **Nusa AI Assistant**, your personal super-app companion.\n\nHow can I help you today? You can ask me to:\n1. **Check your wallet balance** (e.g. *'cek saldo'*)\n2. **Kirim uang / Transfer** (e.g. *'Pay Ibu Sri Rp 50,000 for Spicy Tempeh'*)\n3. **Tambah tugas ke Workspace** (e.g. *'Add task buy milk'*)\n\nTry selecting one of the suggested prompts or quick action cards below!",
      timestamp: new Date().toISOString(),
    },
  ],
  isTyping: false,
  addMessage: (msg) => set((state) => ({
    messages: [
      ...state.messages,
      {
        ...msg,
        id: `aimsg-${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    ],
  })),
  setTyping: (isTyping) => set({ isTyping }),
  clearHistory: () => set({
    messages: [
      {
        id: `ai-init-${Date.now()}`,
        sender: "ai",
        text: "History cleared. How can I help you next?",
        timestamp: new Date().toISOString(),
      },
    ],
  }),
}));
