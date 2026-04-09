import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, ApiError } from "./client";

export const queryKeys = {
  session: ["session"],
  me: ["me"],
  profile: ["profile"],
  recommendations: (options) => ["recommendations", options],
  savedProducts: ["saved-products"],
  personalizedProducts: (options) => ["personalized-products", options],
  productAnalysis: (productId) => ["product-analysis", productId],
};

function invalidateProductData(queryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.savedProducts }),
    queryClient.invalidateQueries({ queryKey: ["personalized-products"] }),
    queryClient.invalidateQueries({ queryKey: ["product-analysis"] }),
    queryClient.invalidateQueries({ queryKey: ["recommendations"] }),
  ]);
}

export function useSessionQuery() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: async () => {
      try {
        return await api.getSessionUser();
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          return null;
        }
        throw error;
      }
    },
  });
}

export function useMeQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: api.getMe,
    enabled,
  });
}

export function useProfileQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: api.getProfile,
    enabled,
  });
}

export function useRecommendationsQuery(options = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.recommendations(options),
    queryFn: () => api.getRecommendations(options),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

export function useSavedProductsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.savedProducts,
    queryFn: api.getSavedProducts,
    enabled,
  });
}

export function usePersonalizedProductsQuery(options = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.personalizedProducts(options),
    queryFn: () => api.searchProducts(options),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

export function useProductAnalysisQuery(productId, enabled = true) {
  return useQuery({
    queryKey: queryKeys.productAnalysis(productId),
    queryFn: () => api.getProductAnalysis(productId),
    enabled: enabled && Boolean(productId),
  });
}

export function useSavedProductAnalyses(productIds = [], enabled = true) {
  return useQueries({
    queries: productIds.map((productId) => ({
      queryKey: queryKeys.productAnalysis(productId),
      queryFn: () => api.getProductAnalysis(productId),
      enabled: enabled && Boolean(productId),
    })),
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.login,
    onSuccess(payload) {
      queryClient.setQueryData(queryKeys.session, payload.user);
      queryClient.setQueryData(queryKeys.me, payload.user);
    },
  });
}

export function useSignupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.signup,
    onSuccess(payload) {
      queryClient.setQueryData(queryKeys.session, payload.user);
      queryClient.setQueryData(queryKeys.me, payload.user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.logout,
    onSuccess() {
      queryClient.setQueryData(queryKeys.session, null);
      queryClient.setQueryData(queryKeys.me, null);
      queryClient.removeQueries({ queryKey: queryKeys.profile });
      queryClient.removeQueries({ queryKey: queryKeys.savedProducts });
      queryClient.removeQueries({ queryKey: ["recommendations"] });
      queryClient.removeQueries({ queryKey: ["personalized-products"] });
      queryClient.removeQueries({ queryKey: ["product-analysis"] });
    },
  });
}

export function useUpsertProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.upsertProfile,
    async onSuccess(profile) {
      queryClient.setQueryData(queryKeys.profile, profile);
      queryClient.setQueryData(queryKeys.session, (currentUser) =>
        currentUser ? { ...currentUser, profile } : currentUser,
      );
      queryClient.setQueryData(queryKeys.me, (currentUser) =>
        currentUser ? { ...currentUser, profile } : currentUser,
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["recommendations"] }),
        queryClient.invalidateQueries({ queryKey: ["personalized-products"] }),
        queryClient.invalidateQueries({ queryKey: ["product-analysis"] }),
      ]);
    },
  });
}

export function useGenerateRecommendationsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.generateRecommendations,
    async onSuccess() {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["recommendations"] }),
        queryClient.invalidateQueries({ queryKey: ["personalized-products"] }),
      ]);
    },
  });
}

export function useSaveProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.saveProduct,
    onSuccess: async () => {
      await invalidateProductData(queryClient);
    },
  });
}

export function useRemoveSavedProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.removeSavedProduct,
    onSuccess: async () => {
      await invalidateProductData(queryClient);
    },
  });
}
