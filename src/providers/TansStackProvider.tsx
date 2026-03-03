import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface TanStackProviderProps {
  children: React.ReactNode;
}

export const TanStackProvider = ({ children }: TanStackProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 min — datos frescos, no refetch innecesario
            gcTime: 1000 * 60 * 10, // 10 min — garbage collection del caché
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
};
