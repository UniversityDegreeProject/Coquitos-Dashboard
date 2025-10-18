// *Library
import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
// *Interfaces
import type { Category } from "../interfaces";


interface CategoryState {
  modalMode : 'create' | 'update' | 'delete' | null;
  categoryToUpdate : Category | null;
  setOpenModalCreate : () => void;
  setOpenModalUpdate : ( category : Category ) => void;
  closeModal : () => void;
}

const categoryApi : StateCreator<CategoryState, [["zustand/devtools", never]], []> = ( set ) => ({
  modalMode : null,
  categoryToUpdate : null,
  setOpenModalCreate : () => set( ( state ) => ({...state, modalMode : 'create' }) , false , "Open create category modal" ),
  setOpenModalUpdate : ( category : Category ) => set( ( state ) => ({...state, modalMode : 'update', categoryToUpdate : category }) , false , "Open update category modal" ),
  closeModal : () => set( ( state ) => ({...state, modalMode : null, categoryToUpdate : null }) , false , "close modal" ),
})

export const useCategoryStore = create<CategoryState>()(
  devtools(
    categoryApi, { name : 'category-store' }
  )
)
