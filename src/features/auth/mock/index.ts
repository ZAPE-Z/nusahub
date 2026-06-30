import { User } from "../types";

export const MOCK_USERS: User[] = [
  {
    id: "user-1",
    email: "budi@nusahub.com",
    name: "Budi Santoso",
    handle: "budi",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
    role: "consumer"
  },
  {
    id: "user-2",
    email: "sri@nusahub.com",
    name: "Ibu Sri",
    handle: "ibusri",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
    role: "merchant"
  },
  {
    id: "user-3",
    email: "andi@nusahub.com",
    name: "Andi Wijaya",
    handle: "andi",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60",
    role: "creator"
  }
];
