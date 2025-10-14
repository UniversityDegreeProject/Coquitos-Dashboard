// *Library
import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
// *Interfaces
import type { User } from "../interfaces";


interface UserState {
  modalMode : 'create' | 'update' | 'delete' | null;
  setOpenModalCreateUser : () => void;
  setOpenModalUpdateUser : ( user : User ) => void;
  deleteUser : () => void;
  closeModal : () => void;
}


const userApi : StateCreator<UserState, [["zustand/devtools", never]], []> = ( set ) => ({
  modalMode : null,
  setOpenModalCreateUser : () => set( ( state ) => ({...state, modalMode : 'create' }) , false , "Open create user modal" ),
  setOpenModalUpdateUser : ( user : User ) => set( ( state ) => ({...state, modalMode : 'update', userToUpdate : user }) , false , "Open update user modal" ),
  deleteUser : () => set( ( state ) => ({...state, modalMode : 'delete' }) , false , "delete user" ),
  closeModal : () => set( ( state ) => ({...state, modalMode : null }) , false , "close modal" ),
})

export const useUserStore = create<UserState>()(
  devtools(
    userApi, { name : 'user-store' }
  )
)
