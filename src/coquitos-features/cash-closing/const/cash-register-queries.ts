/**
 * Definición de query keys para TanStack Query
 * Siguiendo las mejores prácticas de estructura jerárquica
 */
export const cashRegisterQueries = {
  allCashRegisters: ['cash-registers'] as const,
  currentCashRegister: (userId: string) => [...cashRegisterQueries.allCashRegisters, 'current', userId] as const,
  cashRegisterById: (id: string) => [...cashRegisterQueries.allCashRegisters, id] as const,
};

