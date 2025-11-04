import { create, type StateCreator } from 'zustand';
import type { Client } from '../interfaces';
import { devtools } from 'zustand/middleware';

interface ClientStore {
  modalMode : 'create' | 'update' | 'delete' | null;
  clientToUpdate : Client | null;
  isMutation : boolean;
  setIsMutation : ( value : boolean ) => void;
  setOpenModalCreate : () => void;
  setOpenModalUpdate : ( client : Client ) => void;
  closeModal : () => void;
}

const clientApi : StateCreator<ClientStore, [["zustand/devtools", never]], []> = ( set ) => ({
  modalMode: null,
  clientToUpdate: null,
  isMutation: false,
  setIsMutation: (value: boolean) => set({ isMutation: value }),
  setOpenModalCreate: () => set({ modalMode: 'create' }),
  setOpenModalUpdate: (client: Client) => set({ modalMode: 'update', clientToUpdate: client }),
  closeModal: () => set({ modalMode: null, clientToUpdate: null }),
});



export const useClientStore = create<ClientStore>()(
  devtools(
    clientApi,
    { name: 'client-store' }
  )
);