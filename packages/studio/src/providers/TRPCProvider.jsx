import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { trpc } from "../utils/trpc";
import ServerError from "../components/ServerError";

export default function TRPCProvider({ children }) {
  const [isServerError, setIsServerError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const createQueryClient = useCallback(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            onError: (error) => {
              // Bağlantı hatası ise sunucu hatası durumunu aktif et
              if (
                error.message.includes("Failed to fetch") ||
                error.message.includes("Network Error") ||
                error.message.includes("fetch failed") ||
                error.message.includes("ECONNREFUSED") ||
                error.message.includes("socket hang up")
              ) {
                setIsServerError(true);
                setErrorMessage(error.message);
              }
            },
          },
        },
      }),
    []
  );

  const [queryClient] = useState(() => createQueryClient());

  const createTRPCClient = useCallback(() => {
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: `${import.meta.env.VITE_API_URL}/api/v1`,
          headers: () => {
            const token = localStorage.getItem("token");
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
      transformer: superjson,
    });
  }, []);

  const [trpcClient] = useState(() => createTRPCClient());

  // Yeniden bağlanma işlevi
  const handleRetry = () => {
    setIsServerError(false);
    setErrorMessage("");

    // Tüm sorguları geçersiz kıl ve yeniden dene
    queryClient.invalidateQueries();
  };

  // Sunucu hatası varsa ServerError bileşenini göster
  if (isServerError) {
    return <ServerError onRetry={handleRetry} errorDetails={errorMessage} />;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
