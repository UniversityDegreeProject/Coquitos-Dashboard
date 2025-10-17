// *Library
import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
// *Interfaces
import type { User } from "../interfaces";


interface UserState {
  usersInPolling : Set<string>;
  addUserToPolling : (userId: string) => void;
  removeUserFromPolling : (userId: string) => void;
  isUserInPolling : (userId: string) => boolean;
  modalMode : 'create' | 'update' | 'delete' | null;
  userToUpdate : User | null;
  setOpenModalCreate : () => void;
  setOpenModalUpdate : ( user : User ) => void;
  closeModal : () => void;
}


const userApi : StateCreator<UserState, [["zustand/devtools", never]], []> = ( set, get ) => ({
  usersInPolling : new Set<string>(),
  
  addUserToPolling : (userId: string) => set( ( state ) => {
      const newSet = new Set(state.usersInPolling);
      newSet.add(userId);
      return {...state, usersInPolling : newSet };
    }, false, "Add user to polling" 
  ),
  
  removeUserFromPolling : (userId: string) => set( ( state ) => {
      const newSet = new Set(state.usersInPolling);
      newSet.delete(userId);
      return {...state, usersInPolling : newSet };
    }, false, "Remove user from polling" ),
  
  isUserInPolling : (userId: string) => get().usersInPolling.size > 0 && get().usersInPolling.has(userId) ? true : false,
  
  modalMode : null,
  userToUpdate : null,
  setOpenModalCreate : () => set( ( state ) => ({...state, modalMode : 'create' }) , false , "Open create user modal" ),
  setOpenModalUpdate : ( user : User ) => set( ( state ) => ({...state, modalMode : 'update', userToUpdate : user }) , false , "Open update user modal" ),
  closeModal : () => set( ( state ) => ({...state, modalMode : null, userToUpdate : null }) , false , "close modal" ),
})

export const useUserStore = create<UserState>()(
  devtools(
    userApi, { name : 'user-store' }
  )
)
