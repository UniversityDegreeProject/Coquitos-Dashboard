/**
 * Helper para obtener la etiqueta del tipo de documento
 */

export const getDocumentTypeLabel = (documentType: string): string => {
  switch (documentType) {
    case 'CI':
      return 'Cédula de Identidad';
    case 'NIT':
      return 'NIT';
    case 'PASSPORT':
      return 'Pasaporte';
    default:
      return documentType;
  }
};
