/**
 * Helper para formatear números de teléfono
 */

export const formatPhone = (phone: string): string => {
  // Remover todos los caracteres no numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Si tiene 8 dígitos, formatear como celular boliviano
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  
  // Si tiene 7 dígitos, formatear como teléfono fijo
  if (cleaned.length === 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  
  // Si tiene 10 dígitos, formatear con código de país
  if (cleaned.length === 10) {
    return `+591 ${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  
  // Devolver tal como está si no coincide con ningún patrón
  return phone;
};
