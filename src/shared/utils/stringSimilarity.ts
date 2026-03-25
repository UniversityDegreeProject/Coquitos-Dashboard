/**
 * Utilidad para detectar nombres similares usando distancia de Levenshtein.
 * Útil para prevenir registros duplicados con errores tipográficos.
 */

/**
 * Aqui calculo con el algoritmo de  Levenshtein entre dos cadenas.
 * Representa el número mínimo de ediciones (inserción, eliminación, sustitución)
 * necesarias para transformar una cadena en otra.
 */
export const levenshteinDistance = (a: string, b: string): number => {
  const aN = a.length;
  const bN = b.length;

  //? Caso base: una cadena vacía
  if (aN === 0) return bN;
  if (bN === 0) return aN;

  //? Crear matriz de distancias
  const matrix: number[][] = Array.from({ length: aN + 1 }, () =>
    new Array(bN + 1).fill(0),
  );

  //? Inicializar primera columna y fila
  for (let i = 0; i <= aN; i++) matrix[i][0] = i;
  for (let j = 0; j <= bN; j++) matrix[0][j] = j;

  //? Llenar la matriz
  for (let i = 1; i <= aN; i++) {
    for (let j = 1; j <= bN; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Eliminación
        matrix[i][j - 1] + 1, // Inserción
        matrix[i - 1][j - 1] + cost, // Sustitución
      );
    }
  }

  return matrix[aN][bN];
};

/**
 * Algoritmo para calcular porcoentaje (0 a 100).
 * 100 = idénticas, 0 = completamente diferentes.
 */
export const stringSimilarity = (a: string, b: string): number => {
  const normalizedA = a.toLowerCase().trim();
  const normalizedB = b.toLowerCase().trim();

  if (normalizedA === normalizedB) return 100;
  if (normalizedA.length === 0 || normalizedB.length === 0) return 0;

  const maxLength = Math.max(normalizedA.length, normalizedB.length);
  const distance = levenshteinDistance(normalizedA, normalizedB);

  return ((maxLength - distance) / maxLength) * 100;
};

export interface SimilarNameMatch {
  name: string;
  similarity: number;
}

/**
 * Busca nombres similares en una lista existente.
 * @param newName - El nombre que se quiere registrar
 * @param existingNames - Lista de nombres ya existentes
 * @param threshold - Porcentaje mínimo de similitud para considerar como "similar" (default: 70%)
 * @param excludeName - Nombre a excluir de la comparación (útil en modo edición)
 * @returns Array de matches similares, ordenados de mayor a menor similitud
 */
export const findSimilarNames = (
  newName: string,
  existingNames: string[],
  threshold: number = 70,
  excludeName?: string,
): SimilarNameMatch[] => {
  const normalizedNew = newName.toLowerCase().trim();

  if (!normalizedNew) return [];

  return existingNames
    .filter((name) => {
      const normalizedExisting = name.toLowerCase().trim();
      // Excluir el nombre actual (modo edición) y duplicados exactos (ya los maneja el backend)
      if (
        excludeName &&
        normalizedExisting === excludeName.toLowerCase().trim()
      )
        return false;
      if (normalizedExisting === normalizedNew) return false;
      return true;
    })
    .map((name) => ({
      name,
      similarity: stringSimilarity(newName, name),
    }))
    .filter((match) => match.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);
};
