export interface AIMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface SuggestedPrompt {
  id: string;
  text: string;
  category: "wallet" | "workspace" | "general";
}
