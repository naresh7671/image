import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "./use-auth";

export function useSubscription() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const subscription = useQuery({
    queryKey: ["/api/subscription/status"],
    enabled: !!token,
    queryFn: async () => {
      const response = await fetch("/api/subscription/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch subscription");
      return response.json();
    },
  });

  const createSubscription = useMutation({
    mutationFn: async (planId: string) => {
      const response = await fetch("/api/subscription/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  return {
    subscription: subscription.data?.subscription,
    isLoading: subscription.isLoading,
    createSubscription,
    isCreating: createSubscription.isPending,
  };
}
