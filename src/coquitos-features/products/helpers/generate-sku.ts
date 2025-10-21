/**
 * Genera un SKU (código de producto) automático
 * Formato basado en el nombre del producto
 * 
 * Ejemplos:
 * - "Chorizo Clásico" → "CHO-CLA-XXX"
 * - "Salchicha Parrillera" → "SAL-PAR-XXX"
 * - "Longaniza Premium" → "LON-PRE-XXX"
 * 
 * @param productName - Nombre del producto
 * @returns SKU generado automáticamente
 */
export const generateProductSKU = (productName: string): string => {
  // Limpiar y normalizar el nombre
  const cleanName = productName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .toUpperCase()
    .trim();
  
  // Dividir en palabras
  const words = cleanName.split(/\s+/);
  
  // Tomar las primeras 3 letras de las primeras 2 palabras
  let prefix = '';
  if (words.length >= 2) {
    prefix = words[0].substring(0, 3) + '-' + words[1].substring(0, 3);
  } else if (words.length === 1) {
    prefix = words[0].substring(0, 6);
  }
  
  // Generar sufijo único basado en timestamp
  const timestamp = Date.now();
  const suffix = String(timestamp).slice(-3);
  
  return `${prefix}-${suffix}`;
};

/**
 * Genera un SKU basado en categoría y nombre
 * 
 * @param productName - Nombre del producto
 * @param categoryName - Nombre de la categoría
 * @returns SKU con prefijo de categoría
 */
export const generateSKUWithCategory = (productName: string, categoryName: string): string => {
  // Limpiar nombres
  const cleanCategory = categoryName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
  
  const cleanProduct = productName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
  
  // Prefijo de categoría (primeras 3 letras)
  const categoryPrefix = cleanCategory.substring(0, 3);
  
  // Prefijo de producto (primeras 3 letras de la primera palabra)
  const productWords = cleanProduct.split(/\s+/);
  const productPrefix = productWords[0].substring(0, 3);
  
  // Sufijo único
  const timestamp = Date.now();
  const suffix = String(timestamp).slice(-3);
  
  return `${categoryPrefix}-${productPrefix}-${suffix}`;
};

/**
 * Genera un SKU simple con contador secuencial
 * Formato: PRD-XXX
 * 
 * @param existingProducts - Número de productos existentes (para contador)
 * @returns SKU secuencial
 */
export const generateSimpleSKU = (existingProducts: number = 0): string => {
  const counter = String(existingProducts + 1).padStart(3, '0');
  return `PRD-${counter}`;
};

/**
 * Valida si un SKU tiene el formato correcto
 * 
 * @param sku - SKU a validar
 * @returns true si es válido
 */
export const isValidSKU = (sku: string): boolean => {
  // Formato: XXX-XXX-XXX o XXX-XXX
  const skuPattern = /^[A-Z0-9]{2,6}(-[A-Z0-9]{2,6}){1,2}$/;
  return skuPattern.test(sku.toUpperCase());
};

