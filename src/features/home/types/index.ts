export interface ProductRef {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
}

export interface Post {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  avatarUrl: string;
  timestamp: string;
  content: string;
  mediaUrl?: string;
  likeCount: number;
  commentCount: number;
  productRef?: ProductRef;
}

export interface NotificationAlert {
  id: string;
  type: "like" | "comment" | "follow" | "system" | "order";
  message: string;
  timestamp: string;
  isRead: boolean;
  linkUrl?: string;
}
