/**
 * Módulo de Reportes - Única Fuente de Verdad
 * 
 * Este módulo centraliza toda la funcionalidad relacionada con reportes:
 * - Tipos e interfaces
 * - Utilidades de formateo
 * - Servicios de generación (PDF y Excel)
 * 
 * Uso:
 * import { generateDailyReportPDF, generateDailyReportExcel, formatCurrency } from '@/shared/reports';
 */

// Tipos
export * from "./types/report.types";

// Utilidades
export * from "./utils";

// Servicios
export * from "./services";

