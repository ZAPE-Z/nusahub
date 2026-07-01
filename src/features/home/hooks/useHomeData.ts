import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFeedStore } from "@/store/feedStore";

export function useHomeData() {
  const feedStore = useFeedStore();
  const queryClient = useQueryClient();

  // Wrapping Zustand store lists in TanStack Query for caching and loading states consistency
  const postsQuery = useQuery({
    queryKey: ["home-posts", feedStore.posts],
    queryFn: () => feedStore.posts,
  });

  const alertsQuery = useQuery({
    queryKey: ["home-alerts", feedStore.notifications],
    queryFn: () => feedStore.notifications,
  });

  const likePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      feedStore.likePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-posts"] });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      feedStore.markAllNotificationsAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-alerts"] });
    }
  });

  return {
    posts: postsQuery.data || [],
    isLoadingPosts: postsQuery.isLoading,
    postsError: null,
    refetchPosts: postsQuery.refetch,
    alerts: alertsQuery.data || [],
    isLoadingAlerts: alertsQuery.isLoading,
    alertsError: null,
    refetchAlerts: alertsQuery.refetch,
    likePost: likePostMutation.mutate,
    markAllRead: markAllReadMutation.mutate,
  };
}
