/**
 * Genera una referencia automática para movimientos de stock
 * Formato: MOV-YYYYMMDD-XXX
 * 
 * Ejemplos:
 * - MOV-20241021-001
 * - MOV-20241021-002
 * 
 * @returns Referencia única basada en fecha y timestamp
 */
export const generateStockMovementReference = (): string => {
  const now = new Date();
  
  // Formato de fecha: YYYYMMDD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Generar número secuencial basado en timestamp (últimos 3 dígitos del timestamp)
  const timestamp = now.getTime();
  const sequence = String(timestamp).slice(-3);
  
  return `MOV-${dateStr}-${sequence}`;
};

/**
 * Genera una referencia con formato personalizado según el tipo de movimiento
 * 
 * @param type - Tipo de movimiento de stock
 * @returns Referencia formateada según el tipo
 */
export const generateReferenceByType = (
  type: 'Reabastecimiento' | 'Compra' | 'Venta' | 'Ajuste' | 'Devolucion' | 'Dañado'
): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  const timestamp = now.getTime();
  const sequence = String(timestamp).slice(-3);
  
  // Prefijo según tipo de movimiento
  const prefixMap = {
    'Reabastecimiento': 'REAB',
    'Compra': 'COMP',
    'Venta': 'VENT',
    'Ajuste': 'AJST',
    'Devolucion': 'DEVL',
    'Dañado': 'DAÑD',
  };
  
  const prefix = prefixMap[type] || 'MOV';
  
  return `${prefix}-${dateStr}-${sequence}`;
};

