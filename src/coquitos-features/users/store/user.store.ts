// *Library
import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
// *Interfaces
import type { User } from "../interfaces";


interface UserState {
  modalMode : 'create' | 'update' | 'delete' | null;
  userToUpdate : User | null;
  isMutating : boolean;
  pendingEmailVerifications : Set<string>; 
  setOpenModalCreate : () => void;
  setOpenModalUpdate : ( user : User ) => void;
  closeModal : () => void;
  setIsMutating : (value: boolean) => void;
  addPendingEmailVerification : (userId: string) => void;
  removePendingEmailVerification : (userId: string) => void;
}


const userApi : StateCreator<UserState, [["zustand/devtools", never]], []> = ( set ) => ({
  modalMode : null,
  userToUpdate : null,
  isMutating : false,
  pendingEmailVerifications : new Set<string>(),
  setOpenModalCreate : () => set( ( state ) => ({...state, modalMode : 'create' }) , false , "Open create user modal" ),
  setOpenModalUpdate : ( user : User ) => set( ( state ) => ({...state, modalMode : 'update', userToUpdate : user }) , false , "Open update user modal" ),
  closeModal : () => set( ( state ) => ({...state, modalMode : null, userToUpdate : null }) , false , "close modal" ),
  setIsMutating : (value: boolean) => set( ( state ) => ({...state, isMutating : value }) , false , "Set mutating state" ),
  addPendingEmailVerification : (userId: string) => set( 
    ( state ) => ({
      ...state, 
      pendingEmailVerifications : new Set(state.pendingEmailVerifications).add(userId)
    }), 
    false, 
    "Add pending email verification" 
  ),
  removePendingEmailVerification : (userId: string) => set( 
    ( state ) => {
      const newSet = new Set(state.pendingEmailVerifications);
      newSet.delete(userId);
      return {...state, pendingEmailVerifications : newSet};
    }, 
    false, 
    "Remove pending email verification" 
  ),
})

export const useUserStore = create<UserState>()(
  devtools(
    userApi, { name : 'user-store' }
  )
)
