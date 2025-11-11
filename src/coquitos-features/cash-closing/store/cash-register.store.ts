import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Estado del store de cierre de caja
 */
interface CashRegisterState {
  // Modales
  isOpenCashModalOpen: boolean;
  isCloseCashModalOpen: boolean;
  
  // Acciones
  openOpenCashModal: () => void;
  closeOpenCashModal: () => void;
  openCloseCashModal: () => void;
  closeCloseCashModal: () => void;
}

const cashRegisterApi: StateCreator<CashRegisterState, [["zustand/devtools", never]], []> = (set) => ({
  isOpenCashModalOpen: false,
  isCloseCashModalOpen: false,
  
  openOpenCashModal: () => 
    set({ isOpenCashModalOpen: true }, false, "Open cash register modal"),
  
  closeOpenCashModal: () => 
    set({ isOpenCashModalOpen: false }, false, "Close open cash modal"),
  
  openCloseCashModal: () => 
    set({ isCloseCashModalOpen: true }, false, "Open close cash modal"),
  
  closeCloseCashModal: () => 
    set({ isCloseCashModalOpen: false }, false, "Close close cash modal"),
});

export const useCashRegisterStore = create<CashRegisterState>()(
  devtools(cashRegisterApi, { name: 'cash-register-store' })
);

