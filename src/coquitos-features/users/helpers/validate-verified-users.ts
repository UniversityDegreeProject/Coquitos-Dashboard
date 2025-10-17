import type { User } from "../interfaces";

/**
 * Valida si los usuarios en polling ya tienen emailVerified = true
 * Si un usuario ya verificó su email, debe ser removido del polling
 * 
 * @param users - Array de usuarios actuales
 * @param usersInPolling - Set de IDs de usuarios en polling
 * @param removeUserFromPolling - Función para remover usuario del polling
 */
export const validateVerifiedUsers = (users: User[], usersInPolling: Set<string>, removeUserFromPolling: (userId: string) => void): void => {
  usersInPolling.forEach((userId) => {
    // Buscar el usuario en la lista actual
    const user = users.find((u) => u.id === userId);
    
    // Si el usuario existe y ya verificó su email
    if (user && user.emailVerified === true) {
      // Removerlo del polling automáticamente
      removeUserFromPolling(userId);
    }
  });
};

