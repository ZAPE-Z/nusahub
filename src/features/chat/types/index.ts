export interface ProductRef {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  stock?: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string; // ISO string or local readable string
  isRead: boolean;
  productRef?: ProductRef;
}

export interface Participant {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  role: "consumer" | "merchant" | "creator";
}

export interface Conversation {
  id: string;
  participant: Participant;
  messages: Message[];
  isPinned: boolean;
  isTyping: boolean;
}
