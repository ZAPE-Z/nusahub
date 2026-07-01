import { create } from "zustand";

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: "hobbies" | "tech" | "business";
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorName: string;
  text: string;
  timestamp: string;
}

interface CommunityState {
  communities: Community[];
  joinedIds: string[];
  posts: CommunityPost[];
  joinCommunity: (id: string) => void;
  leaveCommunity: (id: string) => void;
  addPost: (communityId: string, authorName: string, text: string) => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  communities: [
    { id: "comm-1", name: "Bandung Culinary MSMEs", description: "Sharing culinary tips, suppliers, and order checkouts inside Bandung.", memberCount: 1420, category: "business" },
    { id: "comm-2", name: "Indonesian Creator Circle", description: "Collab, discuss, and sell design vectors and digital assets.", memberCount: 890, category: "hobbies" },
    { id: "comm-3", name: "Nusa Developers", description: "Deploying widgets and mini apps inside NusaHub super-app sandbox.", memberCount: 650, category: "tech" }
  ],
  joinedIds: ["comm-1"],
  posts: [
    {
      id: "cpost-1",
      communityId: "comm-1",
      authorName: "Ibu Sri",
      text: "Teman-teman, jika ada supplier minyak goreng curah berkualitas di Bandung Barat, mohon hubungi saya ya!",
      timestamp: "1 hour ago"
    },
    {
      id: "cpost-2",
      communityId: "comm-1",
      authorName: "Budi Santoso",
      text: "Mendukung sekali ide kuliner super-app NusaHub, checkout langsung di chat sangat membantu bisnis MSME.",
      timestamp: "Yesterday"
    }
  ],
  joinCommunity: (id) => set((state) => ({
    joinedIds: [...state.joinedIds, id],
    communities: state.communities.map((c) => c.id === id ? { ...c, memberCount: c.memberCount + 1 } : c)
  })),
  leaveCommunity: (id) => set((state) => ({
    joinedIds: state.joinedIds.filter((itemId) => itemId !== id),
    communities: state.communities.map((c) => c.id === id ? { ...c, memberCount: c.memberCount - 1 } : c)
  })),
  addPost: (communityId, authorName, text) => set((state) => ({
    posts: [
      {
        id: `cpost-${Date.now()}`,
        communityId,
        authorName,
        text,
        timestamp: "Just now"
      },
      ...state.posts
    ]
  }))
}));
