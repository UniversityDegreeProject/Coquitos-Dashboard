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
import type { CompleteDashboardReport } from "./pdf.service";

/**
 * Servicio para generar reportes en formato Excel
 * Única fuente de verdad para la generación de archivos Excel
 */

/**
 * Genera un archivo Excel para el reporte diario
 */
export const generateDailyReportExcel = async (
  report: DailyReport
): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reporte Diario");

  // Configurar columnas
  worksheet.columns = [{ width: 30 }, { width: 20 }];

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
    worksheet.getCell(`B${currentRow}`).value = formatCurrency(
      report.cashRegister.openingAmount
    );
    currentRow++;

    worksheet.getCell(`A${currentRow}`).value = "Monto Final:";
    worksheet.getCell(`B${currentRow}`).value = report.cashRegister
      .closingAmount
      ? formatCurrency(report.cashRegister.closingAmount)
      : "N/A";
    currentRow++;

    worksheet.getCell(`A${currentRow}`).value = "Diferencia:";
    worksheet.getCell(`B${currentRow}`).value = report.cashRegister.difference
      ? formatCurrency(report.cashRegister.difference)
      : "N/A";
    worksheet.getCell(`B${currentRow}`).font = {
      color: {
        argb:
          report.cashRegister.difference && report.cashRegister.difference < 0
            ? "FFFF0000"
            : "FF008000",
      },
    };
    currentRow++;

    worksheet.getCell(`A${currentRow}`).value = "Estado:";
    worksheet.getCell(`B${currentRow}`).value = report.cashRegister.status;
    currentRow++;
  } else {
    worksheet.getCell(`A${currentRow}`).value =
      "No hay información de caja disponible";
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
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(
    report.averageTicket
  );
  currentRow++;

  currentRow += 2;

  // Ventas por método de pago
  worksheet.getCell(`A${currentRow}`).value = "Ventas por Método de Pago";
  worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "Efectivo:";
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(
    report.salesByPaymentMethod.cash
  );
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "Tarjeta:";
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(
    report.salesByPaymentMethod.card
  );
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "QR:";
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(
    report.salesByPaymentMethod.qr
  );
  currentRow++;

  // Generar buffer y descargar
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(
    blob,
    `Reporte_Diario_${formatDateShort(report.date).replace(/\//g, "_")}.xlsx`
  );
};

/**
 * Genera un archivo Excel para el reporte de ventas
 */
export const generateSalesReportExcel = async (
  report: SalesReport
): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reporte de Ventas");

  // Configurar columnas
  worksheet.columns = [{ width: 30 }, { width: 20 }];

  // Título
  worksheet.mergeCells("A1:B1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = `Reporte de Ventas - ${formatDateRange(
    report.startDate,
    report.endDate
  )}`;
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
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(
    report.averageTicket
  );
  currentRow++;

  currentRow += 2;

  // Ventas por método de pago
  worksheet.getCell(`A${currentRow}`).value = "Ventas por Método de Pago";
  worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "Efectivo:";
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(
    report.salesByPaymentMethod.cash
  );
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "Tarjeta:";
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(
    report.salesByPaymentMethod.card
  );
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "QR:";
  worksheet.getCell(`B${currentRow}`).value = formatCurrency(
    report.salesByPaymentMethod.qr
  );
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
    `Reporte_Ventas_${formatDateShort(report.startDate).replace(
      /\//g,
      "_"
    )}_${formatDateShort(report.endDate).replace(/\//g, "_")}.xlsx`
  );
};

/**
 * Genera un archivo Excel para el reporte de productos
 */
export const generateProductsReportExcel = async (
  report: ProductsReport
): Promise<void> => {
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
  titleCell.value = `Productos Más Vendidos - ${formatDateRange(
    report.startDate,
    report.endDate
  )}`;
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
    worksheet.getCell(`C${currentRow}`).value = formatCurrency(
      product.totalRevenue
    );
    worksheet.getCell(`D${currentRow}`).value = `${product.percentage.toFixed(
      2
    )}%`;
    currentRow++;
  });

  // Generar buffer y descargar
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(
    blob,
    `Reporte_Productos_${formatDateShort(report.startDate).replace(
      /\//g,
      "_"
    )}_${formatDateShort(report.endDate).replace(/\//g, "_")}.xlsx`
  );
};

/**
 * Genera un archivo Excel para el reporte de clientes
 */
export const generateCustomersReportExcel = async (
  report: CustomersReport
): Promise<void> => {
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
  titleCell.value = `Mejores Clientes - ${formatDateRange(
    report.startDate,
    report.endDate
  )}`;
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
    worksheet.getCell(`C${currentRow}`).value = formatCurrency(
      customer.totalSpent
    );
    worksheet.getCell(`D${currentRow}`).value = `${customer.percentage.toFixed(
      2
    )}%`;
    currentRow++;
  });

  // Generar buffer y descargar
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(
    blob,
    `Reporte_Clientes_${formatDateShort(report.startDate).replace(
      /\//g,
      "_"
    )}_${formatDateShort(report.endDate).replace(/\//g, "_")}.xlsx`
  );
};

/**
 * Genera un archivo Excel para el resumen de cierres de caja
 */
export const generateCashRegisterSummaryExcel = async (
  report: CashRegisterSummaryReport
): Promise<void> => {
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
  titleCell.value = `Resumen de Cierres de Caja - ${formatDateRange(
    report.startDate,
    report.endDate
  )}`;
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
    worksheet.getCell(`D${currentRow}`).value = day.openingAmount
      ? formatCurrency(day.openingAmount)
      : "N/A";
    worksheet.getCell(`E${currentRow}`).value = day.closingAmount
      ? formatCurrency(day.closingAmount)
      : "N/A";
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
    `Resumen_Cierres_${formatDateShort(report.startDate).replace(
      /\//g,
      "_"
    )}_${formatDateShort(report.endDate).replace(/\//g, "_")}.xlsx`
  );
};

/**
 * Genera un archivo Excel completo del dashboard con todos los datos
 * Incluye: KPIs, ventas por hora, métodos de pago, productos más vendidos, mejores clientes y ventas por día
 */
export const generateCompleteDashboardExcel = async (
  report: CompleteDashboardReport
): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const { salesReport, productsReport, customersReport } = report;

  // Calcular número de métodos de pago utilizados
  const paymentMethodsCount = [
    salesReport.salesByPaymentMethod.cash > 0,
    salesReport.salesByPaymentMethod.card > 0,
    salesReport.salesByPaymentMethod.qr > 0,
  ].filter(Boolean).length;

  // Cargar logo de la empresa
  let logoId: number | undefined;
  try {
    // Intentar cargar el logo desde la ruta pública
    const logoResponse = await fetch("/imagen-corporativa.jpg");
    if (logoResponse.ok) {
      const logoBuffer = await logoResponse.arrayBuffer();
      // Convertir ArrayBuffer a Uint8Array para ExcelJS (compatible con navegador)
      const buffer = new Uint8Array(logoBuffer);
      logoId = workbook.addImage({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        buffer: buffer as any,
        extension: "jpeg",
      });
    }
  } catch (error) {
    console.warn("No se pudo cargar el logo:", error);
  }

  // Hoja 1: Resumen General
  const summarySheet = workbook.addWorksheet("Resumen General");
  summarySheet.columns = [{ width: 30 }, { width: 20 }, { width: 20 }];

  let currentRow = 1;

  // Agregar logo si está disponible
  if (logoId !== undefined) {
    summarySheet.addImage(logoId, {
      tl: { col: 0, row: currentRow - 1 },
      ext: { width: 200, height: 100 },
    });
    currentRow += 5; // Espacio después del logo
  }

  summarySheet.mergeCells(`A${currentRow}:B${currentRow}`);
  const titleCell = summarySheet.getCell(`A${currentRow}`);
  titleCell.value = `Reporte Completo de Ventas - ${formatDateRange(
    salesReport.startDate,
    salesReport.endDate
  )}`;
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  currentRow += 2;

  // Resumen General (KPIs)
  summarySheet.getCell(`A${currentRow}`).value = "Resumen General";
  summarySheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
  currentRow++;

  summarySheet.getCell(`A${currentRow}`).value = "Total de Ventas:";
  summarySheet.getCell(`B${currentRow}`).value = formatCurrency(
    salesReport.totalSales
  );
  summarySheet.getCell(`B${currentRow}`).font = { bold: true };
  currentRow++;

  summarySheet.getCell(`A${currentRow}`).value = "Total de Órdenes:";
  summarySheet.getCell(`B${currentRow}`).value = salesReport.totalOrders;
  currentRow++;

  summarySheet.getCell(`A${currentRow}`).value = "Ticket Promedio:";
  summarySheet.getCell(`B${currentRow}`).value = formatCurrency(
    salesReport.averageTicket
  );
  currentRow++;

  summarySheet.getCell(`A${currentRow}`).value = "Métodos de Pago:";
  summarySheet.getCell(`B${currentRow}`).value = paymentMethodsCount;
  currentRow += 2;

  // Ventas por Método de Pago con Gráfico
  summarySheet.getCell(`A${currentRow}`).value = "Ventas por Método de Pago";
  summarySheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
  currentRow++;

  summarySheet.getCell(`A${currentRow}`).value = "Efectivo";
  summarySheet.getCell(`B${currentRow}`).value = Number(
    salesReport.salesByPaymentMethod.cash
  );
  summarySheet.getCell(`C${currentRow}`).value = formatCurrency(
    salesReport.salesByPaymentMethod.cash
  );
  currentRow++;

  summarySheet.getCell(`A${currentRow}`).value = "Tarjeta";
  summarySheet.getCell(`B${currentRow}`).value = Number(
    salesReport.salesByPaymentMethod.card
  );
  summarySheet.getCell(`C${currentRow}`).value = formatCurrency(
    salesReport.salesByPaymentMethod.card
  );
  currentRow++;

  summarySheet.getCell(`A${currentRow}`).value = "QR";
  summarySheet.getCell(`B${currentRow}`).value = Number(
    salesReport.salesByPaymentMethod.qr
  );
  summarySheet.getCell(`C${currentRow}`).value = formatCurrency(
    salesReport.salesByPaymentMethod.qr
  );
  currentRow++;

  // Nota: Los gráficos de ExcelJS requieren configuración adicional en el navegador
  // Por ahora, los datos están disponibles para que el usuario pueda crear gráficos manualmente en Excel

  // Hoja 2: Ventas por Hora con Gráfico
  const hoursWithSales = salesReport.salesByHour.filter((h) => h.total > 0);
  if (hoursWithSales.length > 0) {
    const hourSheet = workbook.addWorksheet("Ventas por Hora");
    hourSheet.columns = [{ width: 15 }, { width: 20 }, { width: 15 }];

    let hourRow = 1;

    // Agregar logo si está disponible
    if (logoId !== undefined) {
      hourSheet.addImage(logoId, {
        tl: { col: 0, row: hourRow - 1 },
        ext: { width: 200, height: 100 },
      });
      hourRow += 5;
    }

    hourSheet.mergeCells(`A${hourRow}:C${hourRow}`);
    const hourTitleCell = hourSheet.getCell(`A${hourRow}`);
    hourTitleCell.value = `Ventas por Hora - ${formatDateRange(
      salesReport.startDate,
      salesReport.endDate
    )}`;
    hourTitleCell.font = { size: 14, bold: true };
    hourTitleCell.alignment = { horizontal: "center", vertical: "middle" };
    hourRow += 2;

    hourSheet.getCell(`A${hourRow}`).value = "Hora";
    hourSheet.getCell(`B${hourRow}`).value = "Total";
    hourSheet.getCell(`C${hourRow}`).value = "Órdenes";
    hourSheet.getRow(hourRow).font = { bold: true };
    hourRow++;

    hoursWithSales.forEach((hour) => {
      hourSheet.getCell(`A${hourRow}`).value = `${hour.hour}:00`;
      hourSheet.getCell(`B${hourRow}`).value = Number(hour.total); // Valor numérico para el gráfico
      hourSheet.getCell(`C${hourRow}`).value = hour.orders;
      hourRow++;
    });

    // Nota: Los gráficos de ExcelJS requieren configuración adicional en el navegador
    // Los datos están disponibles para crear gráficos manualmente en Excel
  }

  // Hoja 3: Productos Más Vendidos con Gráfico
  if (productsReport && productsReport.products.length > 0) {
    const productsSheet = workbook.addWorksheet("Productos Más Vendidos");
    productsSheet.columns = [
      { width: 40 },
      { width: 15 },
      { width: 20 },
      { width: 15 },
    ];

    let productsRow = 1;

    // Agregar logo si está disponible
    if (logoId !== undefined) {
      productsSheet.addImage(logoId, {
        tl: { col: 0, row: productsRow - 1 },
        ext: { width: 200, height: 100 },
      });
      productsRow += 5;
    }

    productsSheet.mergeCells(`A${productsRow}:D${productsRow}`);
    const productsTitleCell = productsSheet.getCell(`A${productsRow}`);
    productsTitleCell.value = `Productos Más Vendidos - ${formatDateRange(
      productsReport.startDate,
      productsReport.endDate
    )}`;
    productsTitleCell.font = { size: 14, bold: true };
    productsTitleCell.alignment = { horizontal: "center", vertical: "middle" };
    productsRow += 2;

    productsSheet.getCell(`A${productsRow}`).value = "Producto";
    productsSheet.getCell(`B${productsRow}`).value = "Cantidad";
    productsSheet.getCell(`C${productsRow}`).value = "Ingresos";
    productsSheet.getCell(`D${productsRow}`).value = "Porcentaje";
    productsSheet.getRow(productsRow).font = { bold: true };
    productsRow++;

    productsReport.products.forEach((product) => {
      productsSheet.getCell(`A${productsRow}`).value = product.productName;
      productsSheet.getCell(`B${productsRow}`).value = product.quantitySold;
      productsSheet.getCell(`C${productsRow}`).value = Number(
        product.totalRevenue
      ); // Valor numérico para el gráfico
      productsSheet.getCell(
        `D${productsRow}`
      ).value = `${product.percentage.toFixed(2)}%`;
      productsRow++;
    });

    // Nota: Los gráficos de ExcelJS requieren configuración adicional en el navegador
    // Los datos están disponibles para crear gráficos manualmente en Excel
  }

  // Hoja 4: Mejores Clientes con Gráfico
  if (customersReport && customersReport.customers.length > 0) {
    const customersSheet = workbook.addWorksheet("Mejores Clientes");
    customersSheet.columns = [
      { width: 40 },
      { width: 15 },
      { width: 20 },
      { width: 15 },
    ];

    let customersRow = 1;

    // Agregar logo si está disponible
    if (logoId !== undefined) {
      customersSheet.addImage(logoId, {
        tl: { col: 0, row: customersRow - 1 },
        ext: { width: 200, height: 100 },
      });
      customersRow += 5;
    }

    customersSheet.mergeCells(`A${customersRow}:D${customersRow}`);
    const customersTitleCell = customersSheet.getCell(`A${customersRow}`);
    customersTitleCell.value = `Mejores Clientes - ${formatDateRange(
      customersReport.startDate,
      customersReport.endDate
    )}`;
    customersTitleCell.font = { size: 14, bold: true };
    customersTitleCell.alignment = { horizontal: "center", vertical: "middle" };
    customersRow += 2;

    customersSheet.getCell(`A${customersRow}`).value = "Cliente";
    customersSheet.getCell(`B${customersRow}`).value = "Órdenes";
    customersSheet.getCell(`C${customersRow}`).value = "Total Gastado";
    customersSheet.getCell(`D${customersRow}`).value = "Porcentaje";
    customersSheet.getRow(customersRow).font = { bold: true };
    customersRow++;

    customersReport.customers.forEach((customer) => {
      customersSheet.getCell(`A${customersRow}`).value = customer.customerName;
      customersSheet.getCell(`B${customersRow}`).value = customer.totalOrders;
      customersSheet.getCell(`C${customersRow}`).value = Number(
        customer.totalSpent
      ); // Valor numérico para el gráfico
      customersSheet.getCell(
        `D${customersRow}`
      ).value = `${customer.percentage.toFixed(2)}%`;
      customersRow++;
    });

    // Nota: Los gráficos de ExcelJS requieren configuración adicional en el navegador
    // Los datos están disponibles para crear gráficos manualmente en Excel
  }

  // Hoja 5: Ventas por Día con Gráfico
  if (salesReport.salesByDay.length > 0) {
    const dailySheet = workbook.addWorksheet("Ventas por Día");
    dailySheet.columns = [{ width: 15 }, { width: 20 }, { width: 15 }];

    let dailyRow = 1;

    // Agregar logo si está disponible
    if (logoId !== undefined) {
      dailySheet.addImage(logoId, {
        tl: { col: 0, row: dailyRow - 1 },
        ext: { width: 200, height: 100 },
      });
      dailyRow += 5;
    }

    dailySheet.mergeCells(`A${dailyRow}:C${dailyRow}`);
    const dailyTitleCell = dailySheet.getCell(`A${dailyRow}`);
    dailyTitleCell.value = `Ventas por Día - ${formatDateRange(
      salesReport.startDate,
      salesReport.endDate
    )}`;
    dailyTitleCell.font = { size: 14, bold: true };
    dailyTitleCell.alignment = { horizontal: "center", vertical: "middle" };
    dailyRow += 2;

    dailySheet.getCell(`A${dailyRow}`).value = "Fecha";
    dailySheet.getCell(`B${dailyRow}`).value = "Total";
    dailySheet.getCell(`C${dailyRow}`).value = "Órdenes";
    dailySheet.getRow(dailyRow).font = { bold: true };
    dailyRow++;

    salesReport.salesByDay.forEach((day) => {
      dailySheet.getCell(`A${dailyRow}`).value = formatDateShort(day.date);
      dailySheet.getCell(`B${dailyRow}`).value = Number(day.total); // Valor numérico para el gráfico
      dailySheet.getCell(`C${dailyRow}`).value = day.orders;
      dailyRow++;
    });

    // Nota: Los gráficos de ExcelJS requieren configuración adicional en el navegador
    // Los datos están disponibles para crear gráficos manualmente en Excel
  }

  // Generar buffer y descargar
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(
    blob,
    `Reporte_Completo_${formatDateShort(salesReport.startDate).replace(
      /\//g,
      "_"
    )}_${formatDateShort(salesReport.endDate).replace(/\//g, "_")}.xlsx`
  );
};
