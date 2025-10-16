// *Library
import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
// *Interfaces
import type { User } from "../interfaces";


interface UserState {
  modalMode : 'create' | 'update' | 'delete' | null;
  userToUpdate : User | null;
  userToDelete : User | null;
  setOpenModalCreate : () => void;
  setOpenModalUpdate : ( user : User ) => void;
  setOpenModalDelete : ( user : User ) => void;
  closeModal : () => void;
}


const userApi : StateCreator<UserState, [["zustand/devtools", never]], []> = ( set ) => ({
  modalMode : null,
  userToUpdate : null,
  userToDelete : null,
  setOpenModalCreate : () => set( ( state ) => ({...state, modalMode : 'create' }) , false , "Open create user modal" ),
  setOpenModalUpdate : ( user : User ) => set( ( state ) => ({...state, modalMode : 'update', userToUpdate : user }) , false , "Open update user modal" ),
  setOpenModalDelete : ( user : User ) => set( ( state ) => ({...state, modalMode : 'delete', userToDelete : user }) , false , "delete user" ),
  closeModal : () => set( ( state ) => ({...state, modalMode : null, userToUpdate : null, userToDelete : null }) , false , "close modal" ),
})

export const useUserStore = create<UserState>()(
  devtools(
    userApi, { name : 'user-store' }
  )
)
