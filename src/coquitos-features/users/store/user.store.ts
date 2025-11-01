// *Library
import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
// *Interfaces
import type { User } from "../interfaces";


interface UserState {
  modalMode : 'create' | 'update' | 'delete' | null;
  userToUpdate : User | null;
  isMutating : boolean;
  setOpenModalCreate : () => void;
  setOpenModalUpdate : ( user : User ) => void;
  closeModal : () => void;
  setIsMutating : (value: boolean) => void;
}


const userApi : StateCreator<UserState, [["zustand/devtools", never]], []> = ( set ) => ({
  modalMode : null,
  userToUpdate : null,
  isMutating : false,
  setOpenModalCreate : () => set( ( state ) => ({...state, modalMode : 'create' }) , false , "Open create user modal" ),
  setOpenModalUpdate : ( user : User ) => set( ( state ) => ({...state, modalMode : 'update', userToUpdate : user }) , false , "Open update user modal" ),
  closeModal : () => set( ( state ) => ({...state, modalMode : null, userToUpdate : null }) , false , "close modal" ),
  setIsMutating : (value: boolean) => set( ( state ) => ({...state, isMutating : value }) , false , "Set mutating state" ),
})

export const useUserStore = create<UserState>()(
  devtools(
    userApi, { name : 'user-store' }
  )
)
