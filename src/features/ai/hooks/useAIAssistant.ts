import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAIStore, AIMessage } from "@/store/aiStore";
import { useToast } from "@/store/useToastStore";
import { parsePrompt } from "@/lib/ai/parser";
import { executeAction } from "@/lib/ai/executor";

export function useAIAssistant() {
  const queryClient = useQueryClient();
  const aiStore = useAIStore();
  const toastStore = useToast();

  const askMutation = useMutation<string, Error, string>({
    mutationFn: async (promptText) => {
      // Step 1: Add the user's prompt directly into history
      aiStore.addMessage({ sender: "user", text: promptText });
      aiStore.setTyping(true);

      // Step 2: Simulate typing latency delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Step 3: Run polymorphic action parser and executor
      const action = parsePrompt(promptText);
      const reply = await executeAction(action, promptText, toastStore);
      return reply;
    },
    onSuccess: (reply) => {
      // Step 4: Save AI response into history and disable loader
      aiStore.addMessage({ sender: "ai", text: reply });
      aiStore.setTyping(false);
      queryClient.invalidateQueries({ queryKey: ["ai-messages"] });
    },
    onError: (err) => {
      aiStore.addMessage({
        sender: "ai",
        text: `⚠️ **System Error:** ${err.message || "Something went wrong in the AI execution flow."}`,
      });
      aiStore.setTyping(false);
    },
  });

  const handleRegenerate = async () => {
    const list = aiStore.messages;
    if (list.length < 2) return;

    // Find the last user message
    let lastUserIndex = -1;
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].sender === "user") {
        lastUserIndex = i;
        break;
      }
    }

    if (lastUserIndex === -1) return;

    const lastUserPrompt = list[lastUserIndex].text;

    // Remove everything from the last user message onwards
    const cleanMessages = list.slice(0, lastUserIndex);
    
    // Reset messages list to clean version, then re-submit
    useAIStore.setState({ messages: cleanMessages });
    
    // Re-ask the assistant
    await askMutation.mutateAsync(lastUserPrompt);
  };

  return {
    messages: aiStore.messages,
    isTyping: aiStore.isTyping,
    ask: askMutation.mutate,
    isAsking: askMutation.isPending,
    clearHistory: aiStore.clearHistory,
    regenerate: handleRegenerate,
  };
}
