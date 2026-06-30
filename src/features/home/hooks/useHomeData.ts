import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MOCK_POSTS, MOCK_NOTIFICATIONS } from "../mock";
import { Post, NotificationAlert } from "../types";

export function useHomeData() {
  const queryClient = useQueryClient();

  const postsQuery = useQuery<Post[], Error>({
    queryKey: ["home-posts"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return MOCK_POSTS;
    },
  });

  const alertsQuery = useQuery<NotificationAlert[], Error>({
    queryKey: ["home-alerts"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return MOCK_NOTIFICATIONS;
    },
  });

  const likePostMutation = useMutation<void, Error, string>({
    mutationFn: async (postId) => {
      // Simulate remote update
      await new Promise((resolve) => setTimeout(resolve, 300));
    },
    onSuccess: (_, postId) => {
      queryClient.setQueryData<Post[]>(["home-posts"], (old) => {
        if (!old) return [];
        return old.map((post) => {
          if (post.id === postId) {
            return { ...post, likeCount: post.likeCount + 1 };
          }
          return post;
        });
      });
    },
  });

  const markAllReadMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      queryClient.setQueryData<NotificationAlert[]>(["home-alerts"], (old) => {
        if (!old) return [];
        return old.map((alert) => ({ ...alert, isRead: true }));
      });
    },
  });

  return {
    posts: postsQuery.data || [],
    isLoadingPosts: postsQuery.isLoading,
    postsError: postsQuery.error ? postsQuery.error.message : null,
    refetchPosts: postsQuery.refetch,
    alerts: alertsQuery.data || [],
    isLoadingAlerts: alertsQuery.isLoading,
    alertsError: alertsQuery.error ? alertsQuery.error.message : null,
    refetchAlerts: alertsQuery.refetch,
    likePost: likePostMutation.mutate,
    markAllRead: markAllReadMutation.mutate,
  };
}
