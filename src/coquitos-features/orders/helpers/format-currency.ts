/**
 * Formatea un número como moneda boliviana (Bs.)
 */
export const formatCurrency = (amount: number): string => {
  return `Bs ${amount.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Formatea un número como moneda corta (sin decimales si es entero)
 */
export const formatCurrencyShort = (amount: number): string => {
  if (Number.isInteger(amount)) {
    return `Bs ${amount.toLocaleString('es-BO')}`;
  }
  return formatCurrency(amount);
};

