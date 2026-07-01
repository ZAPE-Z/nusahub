import { create } from "zustand";

export interface Post {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  avatarUrl?: string;
  timestamp: string;
  content: string;
  likeCount: number;
  commentCount: number;
  productRef?: {
    id: string;
    title: string;
    price: number;
    imageUrl?: string;
  };
}

export interface NotificationAlert {
  id: string;
  type: "order" | "like" | "system";
  message: string;
  timestamp: string;
  isRead: boolean;
  linkUrl?: string;
}

interface FeedState {
  posts: Post[];
  notifications: NotificationAlert[];
  addPost: (post: Omit<Post, "id" | "timestamp" | "likeCount" | "commentCount">) => void;
  likePost: (postId: string) => void;
  addNotification: (notif: Omit<NotificationAlert, "id" | "timestamp" | "isRead">) => void;
  markAllNotificationsAsRead: () => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  posts: [
    {
      id: "post-1",
      creatorId: "user-3",
      creatorName: "Andi Wijaya",
      creatorHandle: "@andi",
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60",
      timestamp: "2 hours ago",
      content: "Hi everyone! I just released a new set of warm cream vector illustrations inspired by Indonesian culture. Check them out directly below!",
      likeCount: 42,
      commentCount: 8,
      productRef: {
        id: "prod-1",
        title: "Warm Cream Vectors Set",
        price: 25000,
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60"
      }
    },
    {
      id: "post-2",
      creatorId: "user-2",
      creatorName: "Ibu Sri",
      creatorHandle: "@ibusri",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
      timestamp: "5 hours ago",
      content: "Our signature Spicy Tempeh chips are fresh out of the kitchen! Handcrafted in Bandung using only premium local ingredients. Get a box now before they sell out!",
      likeCount: 89,
      commentCount: 14,
      productRef: {
        id: "prod-2",
        title: "Spicy Tempeh Crisps (Box)",
        price: 15000,
        imageUrl: "https://images.unsplash.com/photo-1599490659213-e2b9527bb087?w=200&auto=format&fit=crop&q=60"
      }
    },
    {
      id: "post-3",
      creatorId: "user-3",
      creatorName: "Andi Wijaya",
      creatorHandle: "@andi",
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60",
      timestamp: "1 day ago",
      content: "Design is not just what it looks like and feels like. Design is how it works. That is why we are advocating for a horizontal super-app ecosystem.",
      likeCount: 120,
      commentCount: 22
    }
  ],
  notifications: [
    {
      id: "notif-1",
      type: "order",
      message: "Budi Santoso purchased Spicy Tempeh Crisps (Box)",
      timestamp: "10 mins ago",
      isRead: false,
      linkUrl: "/merchant"
    },
    {
      id: "notif-2",
      type: "like",
      message: "Budi Santoso liked your illustration catalog post",
      timestamp: "1 hour ago",
      isRead: false,
      linkUrl: "/home"
    },
    {
      id: "notif-3",
      type: "system",
      message: "Welcome to NusaHub! Secure wallet initialized with simulated Rp 1,000,000.",
      timestamp: "1 day ago",
      isRead: true
    }
  ],
  addPost: (post) => set((state) => ({
    posts: [
      {
        ...post,
        id: `post-${Date.now()}`,
        timestamp: "Just now",
        likeCount: 0,
        commentCount: 0
      },
      ...state.posts
    ]
  })),
  likePost: (postId) => set((state) => ({
    posts: state.posts.map((p) => p.id === postId ? { ...p, likeCount: p.likeCount + 1 } : p)
  })),
  addNotification: (notif) => set((state) => ({
    notifications: [
      {
        ...notif,
        id: `notif-${Date.now()}`,
        timestamp: "Just now",
        isRead: false
      },
      ...state.notifications
    ]
  })),
  markAllNotificationsAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, isRead: true }))
  }))
}));
