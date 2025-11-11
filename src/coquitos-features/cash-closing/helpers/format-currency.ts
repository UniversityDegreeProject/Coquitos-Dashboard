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
 * Formatea diferencia de caja (positiva en verde, negativa en rojo)
 */
export const formatDifference = (difference: number): { text: string; color: string } => {
  const formatted = formatCurrency(Math.abs(difference));
  
  if (difference > 0) {
    return {
      text: `+${formatted}`,
      color: 'text-green-600',
    };
  } else if (difference < 0) {
    return {
      text: `-${formatted}`,
      color: 'text-red-600',
    };
  }
  
  return {
    text: formatted,
    color: 'text-gray-600',
  };
};

