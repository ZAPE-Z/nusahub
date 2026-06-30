import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MOCK_PROFILE_SETTINGS } from "../mock";
import { UserProfileSettings } from "../types";
import { useTheme } from "next-themes";

export function useProfileData() {
  const queryClient = useQueryClient();
  const { setTheme } = useTheme();

  const profileQuery = useQuery<UserProfileSettings, Error>({
    queryKey: ["profile-settings"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_PROFILE_SETTINGS;
    },
  });

  const updateProfileMutation = useMutation<UserProfileSettings, Error, Partial<UserProfileSettings>>({
    mutationFn: async (updatedFields) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const current = queryClient.getQueryData<UserProfileSettings>(["profile-settings"]) || MOCK_PROFILE_SETTINGS;
      const result = { ...current, ...updatedFields };
      return result;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["profile-settings"], data);
      if (data.theme) {
        setTheme(data.theme);
      }
    },
  });

  return {
    settings: profileQuery.data || MOCK_PROFILE_SETTINGS,
    isLoadingSettings: profileQuery.isLoading,
    updateSettings: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  };
}
