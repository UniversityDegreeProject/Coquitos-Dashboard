import { create } from 'zustand';
import type { ClientResponse } from '../interfaces';

interface ClientStore {
  clients: ClientResponse[];
  selectedClient: ClientResponse | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setClients: (clients: ClientResponse[]) => void;
  setSelectedClient: (client: ClientResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addClient: (client: ClientResponse) => void;
  updateClient: (client: ClientResponse) => void;
  removeClient: (clientId: string) => void;
  clearError: () => void;
}

export const useClientStore = create<ClientStore>((set) => ({
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null,
  
  setClients: (clients) => set({ clients }),
  setSelectedClient: (client) => set({ selectedClient: client }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  addClient: (client) => set((state) => ({
    clients: [client, ...state.clients]
  })),
  
  updateClient: (updatedClient) => set((state) => ({
    clients: state.clients.map(client =>
      client.id === updatedClient.id ? updatedClient : client
    )
  })),
  
  removeClient: (clientId) => set((state) => ({
    clients: state.clients.filter(client => client.id !== clientId)
  })),
  
  clearError: () => set({ error: null }),
}));
