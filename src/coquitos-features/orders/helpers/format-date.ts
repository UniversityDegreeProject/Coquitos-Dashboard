/**
 * Formatea una fecha a formato legible en español
 * Ejemplo: 5 de noviembre de 2025, 19:40
 * Formato consistente con clientes y usuarios
 */
export const formatDate = (date: Date | string): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

