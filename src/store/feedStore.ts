import { create } from "zustand";

export interface Comment {
  id: string;
  authorName: string;
  avatarUrl?: string;
  text: string;
  timestamp: string;
}

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
  comments: Comment[];
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
  likedPostIds: string[];
  notifications: NotificationAlert[];
  addPost: (post: Omit<Post, "id" | "timestamp" | "likeCount" | "commentCount" | "comments">) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, authorName: string, text: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
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
      commentCount: 1,
      productRef: {
        id: "prod-1",
        title: "Warm Cream Vectors Set",
        price: 25000,
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60"
      },
      comments: [
        {
          id: "c-1",
          authorName: "Ibu Sri",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
          text: "Vektornya sangat rapi dan warnanya hangat sekali, Andi!",
          timestamp: "1 hour ago"
        }
      ]
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
      commentCount: 2,
      productRef: {
        id: "prod-2",
        title: "Spicy Tempeh Crisps (Box)",
        price: 15000,
        imageUrl: "https://images.unsplash.com/photo-1599490659213-e2b9527bb087?w=200&auto=format&fit=crop&q=60"
      },
      comments: [
        {
          id: "c-2",
          authorName: "Budi Santoso",
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
          text: "Saya sudah pesan satu box kemarin Bu Sri, rasanya pedas renyah mantap!",
          timestamp: "4 hours ago"
        },
        {
          id: "c-3",
          authorName: "Andi Wijaya",
          avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60",
          text: "Bumbu pedasnya pas sekali di lidah.",
          timestamp: "2 hours ago"
        }
      ]
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
      commentCount: 0,
      comments: []
    }
  ],
  likedPostIds: [],
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
        commentCount: 0,
        comments: []
      },
      ...state.posts
    ]
  })),
  likePost: (postId) => set((state) => {
    const isLiked = state.likedPostIds.includes(postId);
    const updatedLikedIds = isLiked
      ? state.likedPostIds.filter((id) => id !== postId)
      : [...state.likedPostIds, postId];
    
    const updatedPosts = state.posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          likeCount: isLiked ? Math.max(0, p.likeCount - 1) : p.likeCount + 1,
        };
      }
      return p;
    });

    return {
      likedPostIds: updatedLikedIds,
      posts: updatedPosts
    };
  }),
  addComment: (postId, authorName, text) => set((state) => ({
    posts: state.posts.map((p) => {
      if (p.id === postId) {
        const newComment: Comment = {
          id: `c-${Date.now()}`,
          authorName,
          text,
          timestamp: "Just now",
          avatarUrl: authorName === "Budi Santoso"
            ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60"
            : undefined
        };
        return {
          ...p,
          commentCount: p.commentCount + 1,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    })
  })),
  deleteComment: (postId, commentId) => set((state) => ({
    posts: state.posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          commentCount: Math.max(0, p.commentCount - 1),
          comments: p.comments.filter((c) => c.id !== commentId)
        };
      }
      return p;
    })
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
