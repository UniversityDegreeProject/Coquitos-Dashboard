import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

interface TransStackProviderProps {
    children: React.ReactNode
}

const queryClient = new QueryClient()

export const TransStackProvider = ({ children }: TransStackProviderProps) => { 
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools />
        </QueryClientProvider>
    )
}
