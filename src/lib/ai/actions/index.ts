import { useWalletStore } from "@/store/walletStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useToast } from "@/store/useToastStore";
import { useAppStore } from "@/store/useAppStore";

export interface AIActionStore {
  walletStore: typeof useWalletStore;
  workspaceStore: typeof useWorkspaceStore;
  toastStore: ReturnType<typeof useToast>;
  appStore: typeof useAppStore;
}

export interface AIAction {
  id: string;
  description: string;
  canHandle: (prompt: string) => boolean;
  execute: (prompt: string, stores: AIActionStore) => Promise<string>;
}

export class CheckBalanceAction implements AIAction {
  id = "check-balance";
  description = "Check current dummy wallet balance";

  canHandle(prompt: string): boolean {
    const p = prompt.toLowerCase();
    return p.includes("balance") || p.includes("saldo") || p.includes("cek saldo");
  }

  async execute(prompt: string, stores: AIActionStore): Promise<string> {
    const balance = stores.walletStore.getState().getBalance();
    return `### 💳 Wallet Balance Inquiry\n\nYour current wallet balance is **Rp ${balance.toLocaleString("id-ID")}**.\n\nYou can use commands like *'Pay Ibu Sri Rp 50,000'* to initiate a mock transfer.`;
  }
}

export class TransferAction implements AIAction {
  id = "transfer";
  description = "Perform peer-to-peer simulated fund transfer";

  canHandle(prompt: string): boolean {
    const p = prompt.toLowerCase();
    return p.includes("pay") || p.includes("transfer") || p.includes("bayar") || p.includes("kirim");
  }

  async execute(prompt: string, stores: AIActionStore): Promise<string> {
    const p = prompt.toLowerCase();
    
    // Simple regex to parse numbers (amount)
    // E.g. Rp 50.000, 50,000, 15000
    const amountMatch = p.match(/(?:rp\.?\s*)?(\d{1,3}(?:\.\d{3})*(?:,\d+)?|\d+)/i);
    let amount = 0;
    if (amountMatch) {
      // Strip out periods and commas to get a raw integer string
      const rawNum = amountMatch[1].replace(/[.,]/g, "");
      amount = parseInt(rawNum, 10);
    }

    if (!amount || amount <= 0) {
      return `❌ **Transfer Failed**\n\nI couldn't detect a valid transfer amount in your prompt. Please write something like: *'Pay Ibu Sri Rp 50,000 for snacks'*.`;
    }

    // Determine recipient
    let recipientName = "Ibu Sri";
    let recipientHandle = "ibusri";
    
    if (p.includes("andi")) {
      recipientName = "Andi Wijaya";
      recipientHandle = "andi";
    } else if (p.includes("budi")) {
      recipientName = "Budi Santoso";
      recipientHandle = "budi";
    }

    const currentBalance = stores.walletStore.getState().getBalance();
    if (currentBalance < amount) {
      stores.toastStore.toast("Insufficient Balance", `You need Rp ${amount.toLocaleString("id-ID")} but only have Rp ${currentBalance.toLocaleString("id-ID")}`, "error");
      return `❌ **Transfer Failed**\n\n**Reason:** Insufficient wallet balance.\n- **Required:** Rp ${amount.toLocaleString("id-ID")}\n- **Current Balance:** Rp ${currentBalance.toLocaleString("id-ID")}`;
    }

    // Deduct and log transaction
    stores.walletStore.getState().updateBalance(currentBalance - amount);
    const tx = stores.walletStore.getState().addTransaction({
      type: "transfer",
      amount,
      recipient: recipientName,
      status: "success",
      note: prompt.length > 50 ? prompt.substring(0, 50) + "..." : prompt,
    });

    stores.toastStore.toast("Payment Sent", `Rp ${amount.toLocaleString("id-ID")} transferred to ${recipientName}`, "success");

    return `### 💸 Transfer Receipt\n\nSimulated funds have been sent successfully.\n\n- **Recipient:** **${recipientName}** (@${recipientHandle})\n- **Amount:** **Rp ${amount.toLocaleString("id-ID")}**\n- **Status:** ✨ Successful\n- **Transaction ID:** \`${tx.id}\`\n- **Date:** ${tx.timestamp}\n\n*Your remaining balance is Rp ${(currentBalance - amount).toLocaleString("id-ID")}.*`;
  }
}

export class AddTaskAction implements AIAction {
  id = "add-task";
  description = "Add checklist task item to workspace dashboard";

  canHandle(prompt: string): boolean {
    const p = prompt.toLowerCase();
    return p.includes("add task") || p.includes("todo") || p.includes("tugas") || p.includes("add checklist") || p.includes("buat tugas");
  }

  async execute(prompt: string, stores: AIActionStore): Promise<string> {
    // Extract task text by removing command prefixes
    let taskText = prompt
      .replace(/add task/i, "")
      .replace(/todo/i, "")
      .replace(/tambah tugas/i, "")
      .replace(/tugas/i, "")
      .replace(/add checklist/i, "")
      .trim();

    // Clean leading/trailing quotes or punctuation if present
    taskText = taskText.replace(/^["'-\s:]+|["'\s:]+$/g, "");

    if (!taskText) {
      taskText = "Generic Task created by Nusa AI";
    }

    stores.workspaceStore.getState().addTask(taskText);
    stores.toastStore.toast("Task Appended", `"${taskText}" added to workspace checklist`, "success");

    return `### 📝 Workspace Checklist Updated\n\nI have added the task to your personal workspace checklist.\n\n- **Task Item:** **"${taskText}"**\n- **Status:** Active (Pending)\n- **Assigned:** Budi Santoso\n\nYou can view and complete this item in your **Workspace** tab.`;
  }
}

export class GeneralChatAction implements AIAction {
  id = "general";
  description = "Warm conversational chatbot fallback";

  canHandle(): boolean {
    return true; // Catch-all fallback
  }

  async execute(prompt: string): Promise<string> {
    const p = prompt.toLowerCase();
    if (p.includes("halo") || p.includes("hi") || p.includes("hello")) {
      return `### 🌟 Halo, Budi!\n\nI am **Nusa AI Assistant**, your personal super-app companion.\n\nHow can I help you today? You can ask me to:\n1. **Check your wallet balance** (e.g. *'cek saldo'*)\n2. **Kirim uang / Transfer** (e.g. *'Pay Ibu Sri Rp 50,000 for Spicy Tempeh'*)\n3. **Tambah tugas ke Workspace** (e.g. *'Add task buy milk'*)\n\nTry selecting one of the suggested prompts or quick action cards below!`;
    }

    return `### 🤖 Nusa AI Assistant\n\nI parsed your message: *"${prompt}"*\n\nAs your super-app assistant, I can orchestrate payments and manage your workflow. Try asking me:\n- *"What is my balance?"*\n- *"Pay Rp 25.000 to Andi Wijaya"* \n- *"Add task review product designs"*`;
  }
}
