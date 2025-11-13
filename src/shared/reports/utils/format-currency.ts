/**
 * Utilidades para formatear moneda
 */

/**
 * Formatea un número como moneda boliviana (Bs.)
 * @param amount - Cantidad a formatear
 * @param decimals - Número de decimales (default: 2)
 * @returns String formateado como "Bs. 1,234.56"
 */
export const formatCurrency = (amount: number, decimals: number = 2): string => {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

/**
 * Formatea un número como moneda sin símbolo
 * @param amount - Cantidad a formatear
 * @param decimals - Número de decimales (default: 2)
 * @returns String formateado como "1,234.56"
 */
export const formatCurrencyNumber = (amount: number, decimals: number = 2): string => {
  return new Intl.NumberFormat("es-BO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

/**
 * Formatea un número como porcentaje
 * @param value - Valor a formatear (0-100)
 * @param decimals - Número de decimales (default: 2)
 * @returns String formateado como "45.67%"
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

