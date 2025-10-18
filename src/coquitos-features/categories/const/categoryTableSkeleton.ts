import type { SkeletonColumn } from "@/shared/loaders-Skeleton";

/**
 * Configuración de columnas para el skeleton loader de la tabla de categorías
 */
export const categoryTableSkeletonColumns: SkeletonColumn[] = [
  { width: 'w-32', lines: 2, avatar: true },  // Categoría con avatar
  { width: 'w-48', lines: 2 },                 // Descripción
  { width: 'w-20', lines: 1, type: 'badge' }, // Estado
  { width: 'w-24', lines: 1 },                 // Fecha
  { width: 'w-auto', lines: 1, align: 'right', type: 'actions', count: 2 } // Acciones (editar, eliminar)
];

