import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "./queryClient";

interface AuthUser {
  id: number;
  phone: string;
}

export function useAuth() {
  const { data: user, isLoading, isFetching } = useQuery<AuthUser | null>({
    queryKey: ["/api/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: 0,
    refetchOnMount: "always",
  });

  return {
    user: user ?? null,
    isLoading: isLoading || isFetching,
    isAuthenticated: !!user,
  };
}
