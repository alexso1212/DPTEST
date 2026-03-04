import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "./queryClient";

interface AuthUser {
  id: number;
  phone: string;
  hasQuizResult: boolean;
  tier: number;
}

export function useAuth() {
  const { data: user, isLoading, isFetching } = useQuery<AuthUser | null>({
    queryKey: ["/api/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: 30000,
  });

  return {
    user: user ?? null,
    isLoading: isLoading || isFetching,
    isAuthenticated: !!user,
  };
}
