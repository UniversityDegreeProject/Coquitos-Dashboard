import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type {
  DailyReport,
  SalesReport,
  ProductsReport,
  CustomersReport,
  CashRegisterSummaryReport,
} from "../types/report.types";
import { formatCurrency, formatDateShort, formatDateRange } from "../utils";

/**
 * Servicio para generar reportes en formato Excel
 * Única fuente de verdad para la generación de archivos Excel
 */

/**
 * Genera un archivo Excel para el reporte diario
 */
export const generateDailyReportExcel = async (report: DailyReport): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reporte Diario");

  // Configurar columnas
  worksheet.columns = [
    { width: 30 },
    { width: 20 },
  ];

  // Título
  worksheet.mergeCells("A1:B1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = `Reporte Diario - ${formatDateShort(report.date)}`;
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };

  // Información del cierre de caja
  let currentRow = 3;
  worksheet.getCell(`A${currentRow}`).value = "Información de Caja";
  worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
  currentRow++;

  if (report.cashRegister) {
    worksheet.getCell(`A${currentRow}`).value = "Monto Inicial:";
    worksheet.getCell(`B${currentRow}`).value = formatCurrency(report.cashRegister.openingAmount);
    currentRow++;

    worksheet.getCell(`A${currentRow}`).value = "Monto Final:";
    worksheet.getCell(`B${currentRow}`).value = report.cashRegister.closingAmount
      ? formatCurrency(report.cashRegister.closingAmount)
      : "N/A";
    currentRow++;

    worksheet.getCell(`A${currentRow}`).value = "Diferencia:";
    worksheet.getCell(`B${currentRow}`).value = report.cashRegister.difference
      ? formatCurrency(report.cashRegister.difference)
      : "N/A";
    worksheet.getCell(`B${currentRow}`).font = {
      color: { argb: report.cashRegister.difference && report.cashRegister.difference < 0 ? "FFFF0000" : "FF008000" },
    };
    currentRow++;

    worksheet.getCell(`A${currentRow}`).value = "Estado:";
    worksheet.getCell(`B${currentRow}`).value = report.cashRegister.status;
    currentRow++;
  } else {
    worksheet.getCell(`A${currentRow}`).value = "No hay información de caja disponible";
    currentRow++;
  }

  currentRow += 2;

  // Resumen de ventas
  worksheet.getCell(`A${currentRow}`).value = "Resumen de Ventas";
  worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "Total de Ventas:";
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(report.totalSales);
  worksheet.getCell(`B${currentRow}`).font = { bold: true };
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "Total de Órdenes:";
  worksheet.getCell(`B${currentRow}`).value = report.totalOrders;
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "Ticket Promedio:";
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(report.averageTicket);
  currentRow++;

  currentRow += 2;

  // Ventas por método de pago
  worksheet.getCell(`A${currentRow}`).value = "Ventas por Método de Pago";
  worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "Efectivo:";
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(report.salesByPaymentMethod.cash);
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "Tarjeta:";
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(report.salesByPaymentMethod.card);
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "QR:";
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(report.salesByPaymentMethod.qr);
  currentRow++;

  // Generar buffer y descargar
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `Reporte_Diario_${formatDateShort(report.date).replace(/\//g, "_")}.xlsx`);
};

/**
 * Genera un archivo Excel para el reporte de ventas
 */
export const generateSalesReportExcel = async (report: SalesReport): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reporte de Ventas");

  // Configurar columnas
  worksheet.columns = [
    { width: 30 },
    { width: 20 },
  ];

  // Título
  worksheet.mergeCells("A1:B1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = `Reporte de Ventas - ${formatDateRange(report.startDate, report.endDate)}`;
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };

  let currentRow = 3;

  // Resumen general
  worksheet.getCell(`A${currentRow}`).value = "Resumen General";
  worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "Total de Ventas:";
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(report.totalSales);
  worksheet.getCell(`B${currentRow}`).font = { bold: true };
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "Total de Órdenes:";
  worksheet.getCell(`B${currentRow}`).value = report.totalOrders;
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "Ticket Promedio:";
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(report.averageTicket);
  currentRow++;

  currentRow += 2;

  // Ventas por método de pago
  worksheet.getCell(`A${currentRow}`).value = "Ventas por Método de Pago";
  worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "Efectivo:";
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(report.salesByPaymentMethod.cash);
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "Tarjeta:";
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(report.salesByPaymentMethod.card);
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "QR:";
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(report.salesByPaymentMethod.qr);
  currentRow++;

  currentRow += 2;

  // Ventas por día
  if (report.salesByDay.length > 0) {
    worksheet.getCell(`A${currentRow}`).value = "Ventas por Día";
    worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
    currentRow++;

    // Encabezados
    worksheet.getCell(`A${currentRow}`).value = "Fecha";
    worksheet.getCell(`B${currentRow}`).value = "Total";
    worksheet.getRow(currentRow).font = { bold: true };
    currentRow++;

    report.salesByDay.forEach((day) => {
      worksheet.getCell(`A${currentRow}`).value = formatDateShort(day.date);
      worksheet.getCell(`B${currentRow}`).value = formatCurrency(day.total);
      currentRow++;
    });
  }

  // Generar buffer y descargar
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(
    blob,
    `Reporte_Ventas_${formatDateShort(report.startDate).replace(/\//g, "_")}_${formatDateShort(report.endDate).replace(/\//g, "_")}.xlsx`
  );
};

/**
 * Genera un archivo Excel para el reporte de productos
 */
export const generateProductsReportExcel = async (report: ProductsReport): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Productos Más Vendidos");

  // Configurar columnas
  worksheet.columns = [
    { width: 40 },
    { width: 15 },
    { width: 20 },
    { width: 15 },
  ];

  // Título
  worksheet.mergeCells("A1:D1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = `Productos Más Vendidos - ${formatDateRange(report.startDate, report.endDate)}`;
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };

  let currentRow = 3;

  // Encabezados
  worksheet.getCell(`A${currentRow}`).value = "Producto";
  worksheet.getCell(`B${currentRow}`).value = "Cantidad";
  worksheet.getCell(`C${currentRow}`).value = "Ingresos";
  worksheet.getCell(`D${currentRow}`).value = "Porcentaje";
  worksheet.getRow(currentRow).font = { bold: true };
  currentRow++;

  // Datos
  report.products.forEach((product) => {
    worksheet.getCell(`A${currentRow}`).value = product.productName;
    worksheet.getCell(`B${currentRow}`).value = product.quantitySold;
    worksheet.getCell(`C${currentRow}`).value = formatCurrency(product.totalRevenue);
    worksheet.getCell(`D${currentRow}`).value = `${product.percentage.toFixed(2)}%`;
    currentRow++;
  });

  // Generar buffer y descargar
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(
    blob,
    `Reporte_Productos_${formatDateShort(report.startDate).replace(/\//g, "_")}_${formatDateShort(report.endDate).replace(/\//g, "_")}.xlsx`
  );
};

/**
 * Genera un archivo Excel para el reporte de clientes
 */
export const generateCustomersReportExcel = async (report: CustomersReport): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Mejores Clientes");

  // Configurar columnas
  worksheet.columns = [
    { width: 40 },
    { width: 15 },
    { width: 20 },
    { width: 15 },
  ];

  // Título
  worksheet.mergeCells("A1:D1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = `Mejores Clientes - ${formatDateRange(report.startDate, report.endDate)}`;
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };

  let currentRow = 3;

  // Encabezados
  worksheet.getCell(`A${currentRow}`).value = "Cliente";
  worksheet.getCell(`B${currentRow}`).value = "Órdenes";
  worksheet.getCell(`C${currentRow}`).value = "Total Gastado";
  worksheet.getCell(`D${currentRow}`).value = "Porcentaje";
  worksheet.getRow(currentRow).font = { bold: true };
  currentRow++;

  // Datos
  report.customers.forEach((customer) => {
    worksheet.getCell(`A${currentRow}`).value = customer.customerName;
    worksheet.getCell(`B${currentRow}`).value = customer.totalOrders;
    worksheet.getCell(`C${currentRow}`).value = formatCurrency(customer.totalSpent);
    worksheet.getCell(`D${currentRow}`).value = `${customer.percentage.toFixed(2)}%`;
    currentRow++;
  });

  // Generar buffer y descargar
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(
    blob,
    `Reporte_Clientes_${formatDateShort(report.startDate).replace(/\//g, "_")}_${formatDateShort(report.endDate).replace(/\//g, "_")}.xlsx`
  );
};

/**
 * Genera un archivo Excel para el resumen de cierres de caja
 */
export const generateCashRegisterSummaryExcel = async (report: CashRegisterSummaryReport): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Resumen de Cierres");

  // Configurar columnas
  worksheet.columns = [
    { width: 15 },
    { width: 20 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
  ];

  // Título
  worksheet.mergeCells("A1:G1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = `Resumen de Cierres de Caja - ${formatDateRange(report.startDate, report.endDate)}`;
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };

  let currentRow = 3;

  // Encabezados
  worksheet.getCell(`A${currentRow}`).value = "Fecha";
  worksheet.getCell(`B${currentRow}`).value = "Total Ventas";
  worksheet.getCell(`C${currentRow}`).value = "Total Órdenes";
  worksheet.getCell(`D${currentRow}`).value = "Monto Inicial";
  worksheet.getCell(`E${currentRow}`).value = "Monto Final";
  worksheet.getCell(`F${currentRow}`).value = "Diferencia";
  worksheet.getCell(`G${currentRow}`).value = "Estado";
  worksheet.getRow(currentRow).font = { bold: true };
  currentRow++;

  // Datos
  report.days.forEach((day) => {
    worksheet.getCell(`A${currentRow}`).value = formatDateShort(day.date);
    worksheet.getCell(`B${currentRow}`).value = formatCurrency(day.totalSales);
    worksheet.getCell(`C${currentRow}`).value = day.totalOrders;
    worksheet.getCell(`D${currentRow}`).value = day.openingAmount ? formatCurrency(day.openingAmount) : "N/A";
    worksheet.getCell(`E${currentRow}`).value = day.closingAmount ? formatCurrency(day.closingAmount) : "N/A";
    const diffCell = worksheet.getCell(`F${currentRow}`);
    diffCell.value = day.difference ? formatCurrency(day.difference) : "N/A";
    if (day.difference && day.difference < 0) {
      diffCell.font = { color: { argb: "FFFF0000" } };
    } else if (day.difference && day.difference > 0) {
      diffCell.font = { color: { argb: "FF008000" } };
    }
    worksheet.getCell(`G${currentRow}`).value = day.status;
    currentRow++;
  });

  // Generar buffer y descargar
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(
    blob,
    `Resumen_Cierres_${formatDateShort(report.startDate).replace(/\//g, "_")}_${formatDateShort(report.endDate).replace(/\//g, "_")}.xlsx`
  );
};

