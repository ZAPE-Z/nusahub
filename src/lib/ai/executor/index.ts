import { AIAction, AIActionStore } from "../actions";
import { useWalletStore } from "@/store/walletStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useToast } from "@/store/useToastStore";
import { useAppStore } from "@/store/useAppStore";

/**
 * Executes a parsed AIAction, supplying it with the necessary global stores.
 */
export async function executeAction(action: AIAction, prompt: string, toastStore: ReturnType<typeof useToast>): Promise<string> {
  const stores: AIActionStore = {
    walletStore: useWalletStore,
    workspaceStore: useWorkspaceStore,
    toastStore,
    appStore: useAppStore,
  };

  return await action.execute(prompt, stores);
}
