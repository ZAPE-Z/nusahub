import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "@/store/useAppStore";
import { MOCK_USERS } from "../mock";
import { User } from "../types";

export function useAuth() {
  const setUser = useAppStore((state) => state.setUser);
  const user = useAppStore((state) => state.user);
  const logoutStore = useAppStore((state) => state.logout);

  const loginMutation = useMutation<User, Error, { email: string }>({
    mutationFn: async ({ email }) => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      const matched = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!matched) {
        throw new Error("Invalid email or password");
      }
      return matched;
    },
    onSuccess: (data) => {
      setUser(data);
    },
  });

  const registerMutation = useMutation<User, Error, { name: string; handle: string; email: string }>({
    mutationFn: async ({ name, handle, email }) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        handle: handle.replace("@", ""),
        role: "consumer",
      };
      return newUser;
    },
    onSuccess: (data) => {
      setUser(data);
    },
  });

  const forgotPasswordMutation = useMutation<boolean, Error, { email: string }>({
    mutationFn: async ({ email }) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }
      return true;
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error ? loginMutation.error.message : null,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error ? registerMutation.error.message : null,
    resetPassword: forgotPasswordMutation.mutateAsync,
    isResetting: forgotPasswordMutation.isPending,
    resetError: forgotPasswordMutation.error ? forgotPasswordMutation.error.message : null,
    logout: logoutStore,
  };
}
