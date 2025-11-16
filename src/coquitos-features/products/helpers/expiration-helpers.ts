import type { Product, ProductBatch } from "../interfaces";

/**
 * Calcula los días restantes hasta la fecha de vencimiento
 * Extrae directamente año, mes y día del string ISO para evitar problemas de zona horaria
 * @param expirationDate - Fecha de vencimiento (Date, string, null o undefined)
 * @returns Número de días restantes (puede ser negativo si ya venció)
 */
export const getDaysUntilExpiration = (expirationDate: Date | string | null | undefined): number | null => {
  if (!expirationDate) return null;
  
  let expirationDateObj: Date;
  
  // Si es string, extraer directamente YYYY-MM-DD y crear Date en zona horaria local
  if (typeof expirationDate === 'string') {
    const dateMatch = expirationDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      // Crear Date usando componentes locales (no UTC) para evitar cambios de día
      expirationDateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      // Fallback: usar Date normal si no es formato ISO
      expirationDateObj = new Date(expirationDate);
    }
  } else {
    expirationDateObj = expirationDate;
  }
  
  if (isNaN(expirationDateObj.getTime())) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expirationDateObj.setHours(0, 0, 0, 0);
  
  const diffTime = expirationDateObj.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Verifica si un producto está próximo a vencer (4, 3 o 2 días)
 * NO incluye el día exacto (0) ni mañana (1)
 * @param product - Producto a verificar
 * @returns true si está próximo a vencer (4, 3 o 2 días)
 */
export const isProductNearExpiration = (product: Product): boolean => {
  // Para productos con batches, verificar el batch más próximo a vencer
  if (product.isVariableWeight && product.batches && product.batches.length > 0) {
    const batchesWithStock = product.batches.filter(batch => batch.stock > 0);
    if (batchesWithStock.length === 0) return false;
    
    // Encontrar el batch con la fecha de vencimiento más cercana
    const nearestBatch = batchesWithStock.reduce((nearest, batch) => {
      if (!batch.expirationDate) return nearest;
      if (!nearest) return batch;
      
      const nearestDays = getDaysUntilExpiration(nearest.expirationDate);
      const batchDays = getDaysUntilExpiration(batch.expirationDate);
      
      if (nearestDays === null) return batch;
      if (batchDays === null) return nearest;
      
      return batchDays < nearestDays ? batch : nearest;
    }, null as ProductBatch | null);
    
    if (!nearestBatch || !nearestBatch.expirationDate) return false;
    
    const days = getDaysUntilExpiration(nearestBatch.expirationDate);
    // Solo 4, 3 o 2 días (no 0 ni 1)
    return days !== null && days >= 2 && days <= 4;
  }
  
  // Para productos sin batches, verificar la fecha del producto
  if (!product.expirationDate) return false;
  
  const days = getDaysUntilExpiration(product.expirationDate);
  // Solo 4, 3 o 2 días (no 0 ni 1)
  return days !== null && days >= 2 && days <= 4;
};

/**
 * Verifica si un producto está próximo a vencer (incluye 4, 3, 2, 1 días y hoy)
 * Para usar en filtros que deben mostrar todos los productos próximos a vencer
 * @param product - Producto a verificar
 * @returns true si está próximo a vencer (4, 3, 2, 1 días o hoy)
 */
export const isProductExpiringSoon = (product: Product): boolean => {
  // Para productos con batches, verificar el batch más próximo a vencer
  if (product.isVariableWeight && product.batches && product.batches.length > 0) {
    const batchesWithStock = product.batches.filter(batch => batch.stock > 0);
    if (batchesWithStock.length === 0) return false;
    
    // Encontrar el batch con la fecha de vencimiento más cercana
    const nearestBatch = batchesWithStock.reduce((nearest, batch) => {
      if (!batch.expirationDate) return nearest;
      if (!nearest) return batch;
      
      const nearestDays = getDaysUntilExpiration(nearest.expirationDate);
      const batchDays = getDaysUntilExpiration(batch.expirationDate);
      
      if (nearestDays === null) return batch;
      if (batchDays === null) return nearest;
      
      return batchDays < nearestDays ? batch : nearest;
    }, null as ProductBatch | null);
    
    if (!nearestBatch || !nearestBatch.expirationDate) return false;
    
    const days = getDaysUntilExpiration(nearestBatch.expirationDate);
    // Incluye 4, 3, 2, 1 días y hoy (0)
    return days !== null && days >= 0 && days <= 4;
  }
  
  // Para productos sin batches, verificar la fecha del producto
  if (!product.expirationDate) return false;
  
  const days = getDaysUntilExpiration(product.expirationDate);
  // Incluye 4, 3, 2, 1 días y hoy (0)
  return days !== null && days >= 0 && days <= 4;
};

/**
 * Verifica si un producto está vencido o vence hoy
 * Para excluir de ventas/órdenes
 * @param product - Producto a verificar
 * @returns true si está vencido o vence hoy
 */
export const isProductExpiredOrExpiringToday = (product: Product): boolean => {
  // Para productos con batches, verificar el batch más próximo a vencer
  if (product.isVariableWeight && product.batches && product.batches.length > 0) {
    const batchesWithStock = product.batches.filter(batch => batch.stock > 0);
    if (batchesWithStock.length === 0) return false;
    
    // Encontrar el batch con la fecha de vencimiento más cercana
    const nearestBatch = batchesWithStock.reduce((nearest, batch) => {
      if (!batch.expirationDate) return nearest;
      if (!nearest) return batch;
      
      const nearestDays = getDaysUntilExpiration(nearest.expirationDate);
      const batchDays = getDaysUntilExpiration(batch.expirationDate);
      
      if (nearestDays === null) return batch;
      if (batchDays === null) return nearest;
      
      return batchDays < nearestDays ? batch : nearest;
    }, null as ProductBatch | null);
    
    if (!nearestBatch || !nearestBatch.expirationDate) return false;
    
    const days = getDaysUntilExpiration(nearestBatch.expirationDate);
    // Vencido (< 0) o vence hoy (0)
    return days !== null && days <= 0;
  }
  
  // Para productos sin batches, verificar la fecha del producto
  if (!product.expirationDate) return false;
  
  const days = getDaysUntilExpiration(product.expirationDate);
  // Vencido (< 0) o vence hoy (0)
  return days !== null && days <= 0;
};

/**
 * Obtiene la fecha de vencimiento más cercana de un producto
 * @param product - Producto
 * @returns Fecha de vencimiento más cercana o null
 */
export const getNearestExpirationDate = (product: Product): Date | string | null => {
  // Para productos con batches, encontrar el batch con fecha más cercana
  if (product.isVariableWeight && product.batches && product.batches.length > 0) {
    const batchesWithStock = product.batches.filter(batch => batch.stock > 0);
    if (batchesWithStock.length === 0) return null;
    
    const nearestBatch = batchesWithStock.reduce((nearest, batch) => {
      if (!batch.expirationDate) return nearest;
      if (!nearest) return batch;
      
      const nearestDays = getDaysUntilExpiration(nearest.expirationDate);
      const batchDays = getDaysUntilExpiration(batch.expirationDate);
      
      if (nearestDays === null) return batch;
      if (batchDays === null) return nearest;
      
      return batchDays < nearestDays ? batch : nearest;
    }, null as ProductBatch | null);
    
    return nearestBatch?.expirationDate || null;
  }
  
  // Para productos sin batches, retornar la fecha del producto
  return product.expirationDate || null;
};

/**
 * Formatea la fecha de vencimiento para mostrar al usuario
 * Extrae directamente año, mes y día del string ISO para evitar problemas de zona horaria
 * @param expirationDate - Fecha de vencimiento (Date, string, null o undefined)
 * @returns String formateado (ej: "15/01/2024")
 */
export const formatExpirationDate = (expirationDate: Date | string | null | undefined): string => {
  if (!expirationDate) return '';
  
  // Si es string, extraer directamente YYYY-MM-DD sin convertir a Date primero
  if (typeof expirationDate === 'string') {
    const dateMatch = expirationDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      return `${day}/${month}/${year}`;
    }
  }
  
  // Si es Date, usar toLocaleDateString como fallback
  const date = typeof expirationDate === 'string' ? new Date(expirationDate) : expirationDate;
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

