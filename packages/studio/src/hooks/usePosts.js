import { trpc } from "../utils/trpc";

export function usePosts(limit = 10, categoryId = undefined) {
  return trpc.post.getAll.useQuery(
    { limit, category_id: categoryId },
    // Veri önbelleği ayarları
    { staleTime: 1000 * 60, // 1 dakika
      keepPreviousData: true }
  );
}