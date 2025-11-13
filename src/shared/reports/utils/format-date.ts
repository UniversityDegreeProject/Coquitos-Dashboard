/**
 * Utilidades para formatear fechas
 */

/**
 * Formatea una fecha a formato legible
 * @param date - Fecha como string o Date
 * @returns String formateado como "15 de enero de 2024"
 */
export const formatDateLong = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-BO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
};

/**
 * Formatea una fecha a formato corto
 * @param date - Fecha como string o Date
 * @returns String formateado como "15/01/2024"
 */
export const formatDateShort = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-BO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateObj);
};

/**
 * Formatea una fecha y hora
 * @param date - Fecha como string o Date
 * @returns String formateado como "15/01/2024 14:30"
 */
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-BO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

/**
 * Formatea un rango de fechas
 * @param startDate - Fecha de inicio
 * @param endDate - Fecha de fin
 * @returns String formateado como "15/01/2024 - 20/01/2024"
 */
export const formatDateRange = (startDate: string | Date, endDate: string | Date): string => {
  return `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;
};

/**
 * Obtiene el nombre del mes en español
 * @param monthIndex - Índice del mes (0-11)
 * @returns Nombre del mes
 */
export const getMonthName = (monthIndex: number): string => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return months[monthIndex] || "";
};

