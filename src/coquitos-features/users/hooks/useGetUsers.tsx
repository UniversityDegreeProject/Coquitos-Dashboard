import { useQuery } from "@tanstack/react-query"
import { useQuerys } from "../const/use-querys"
import { getUsers } from "../services/use.service"
import { useShallow } from "zustand/shallow";
import { useUserStore } from "../store/user.store";

export const useGetUsers =() => {

  // Obtener el Set de usuarios en polling
  const usersInPolling = useUserStore(useShallow((state) => state.usersInPolling));
  
  //* Solo activar polling si hay al menos un usuario esperando
  const hasUsersInPolling = usersInPolling.size > 0;

  const useQueryUsers = useQuery({
    queryKey: useQuerys.allUsers,
    queryFn: () => getUsers(),

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: 1000,
    enabled: true,
    
    // *Polling inteligente: solo cuando hay usuarios esperando verificación
    refetchIntervalInBackground: hasUsersInPolling,
    refetchInterval: hasUsersInPolling ? 2000 : false, 
  })

  return {
    ...useQueryUsers,
  }
} 
