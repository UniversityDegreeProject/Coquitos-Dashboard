/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf, Image } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import type {
  DailyReport,
  SalesReport,
  ProductsReport,
  CustomersReport,
  CashRegisterSummaryReport,
  SellersReport,
} from "../types/report.types";
import { formatCurrency, formatDateShort, formatDateRange } from "../utils";

// Tipo para el reporte completo del dashboard
export interface CompleteDashboardReport {
  salesReport: SalesReport;
  productsReport?: ProductsReport;
  customersReport?: CustomersReport;
  sellersReport?: SellersReport;
}

/**
 * Servicio para generar reportes en formato PDF
 * Única fuente de verdad para la generación de archivos PDF
 * Nota: Los componentes React aquí son internos del servicio, por lo que se deshabilita el warning de Fast Refresh
 */

// Estilos para PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    borderBottom: "1px solid #000",
    paddingBottom: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: "50%",
    fontWeight: "bold",
  },
  value: {
    width: "50%",
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 8,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottom: "1px solid #e0e0e0",
  },
  tableCell: {
    flex: 1,
  },
  footer: {
    marginTop: 30,
    fontSize: 8,
    textAlign: "center",
    color: "#666",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 80,
    marginBottom: 10,
    objectFit: "contain",
  },
  chartContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 150,
    marginBottom: 10,
    paddingVertical: 10,
  },
  bar: {
    flex: 1,
    marginHorizontal: 2,
    backgroundColor: "#FF8C42",
    borderRadius: 2,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 7,
    textAlign: "center",
    marginTop: 5,
  },
  barValue: {
    fontSize: 7,
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
  },
  paymentMethodRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 5,
  },
  paymentMethodBar: {
    height: 20,
    borderRadius: 3,
    marginLeft: 10,
    marginRight: 10,
  },
  paymentMethodLabel: {
    width: 80,
    fontSize: 9,
    fontWeight: "bold",
  },
  paymentMethodValue: {
    width: 80,
    fontSize: 9,
    textAlign: "right",
  },
  paymentMethodPercentage: {
    width: 50,
    fontSize: 8,
    textAlign: "right",
    color: "#666",
  },
});

/**
 * Componente PDF para Reporte Diario
 */
const DailyReportPDF: React.FC<{ report: DailyReport }> = ({ report }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Reporte Diario</Text>
      <Text style={{ textAlign: "center", marginBottom: 20 }}>
        {formatDateShort(report.date)}
      </Text>

      {report.cashRegister && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Caja</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Monto Inicial:</Text>
            <Text style={styles.value}>{formatCurrency(report.cashRegister.openingAmount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Monto Final:</Text>
            <Text style={styles.value}>
              {report.cashRegister.closingAmount
                ? formatCurrency(report.cashRegister.closingAmount)
                : "N/A"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Diferencia:</Text>
            <Text style={styles.value}>
              {report.cashRegister.difference ? formatCurrency(report.cashRegister.difference) : "N/A"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={styles.value}>{report.cashRegister.status}</Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen de Ventas</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total de Ventas:</Text>
          <Text style={styles.value}>{formatCurrency(report.totalSales)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total de Órdenes:</Text>
          <Text style={styles.value}>{report.totalOrders}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Venta Promedio:</Text>
          <Text style={styles.value}>{formatCurrency(report.averageTicket)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ventas por Método de Pago</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Efectivo:</Text>
          <Text style={styles.value}>{formatCurrency(report.salesByPaymentMethod.cash)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tarjeta:</Text>
          <Text style={styles.value}>{formatCurrency(report.salesByPaymentMethod.card)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>QR:</Text>
          <Text style={styles.value}>{formatCurrency(report.salesByPaymentMethod.qr)}</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Generado el {new Date().toLocaleDateString("es-BO")} a las {new Date().toLocaleTimeString("es-BO")}
      </Text>
    </Page>
  </Document>
);

/**
 * Componente PDF para Reporte de Ventas
 */
const SalesReportPDF: React.FC<{ report: SalesReport }> = ({ report }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Reporte de Ventas</Text>
      <Text style={{ textAlign: "center", marginBottom: 20 }}>
        {formatDateRange(report.startDate, report.endDate)}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen General</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total de Ventas:</Text>
          <Text style={styles.value}>{formatCurrency(report.totalSales)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total de Órdenes:</Text>
          <Text style={styles.value}>{report.totalOrders}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Venta Promedio:</Text>
          <Text style={styles.value}>{formatCurrency(report.averageTicket)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ventas por Método de Pago</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Efectivo:</Text>
          <Text style={styles.value}>{formatCurrency(report.salesByPaymentMethod.cash)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tarjeta:</Text>
          <Text style={styles.value}>{formatCurrency(report.salesByPaymentMethod.card)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>QR:</Text>
          <Text style={styles.value}>{formatCurrency(report.salesByPaymentMethod.qr)}</Text>
        </View>
      </View>

      {report.salesByDay.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ventas por Día</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCell}>Fecha</Text>
              <Text style={styles.tableCell}>Total</Text>
              <Text style={styles.tableCell}>Órdenes</Text>
            </View>
            {report.salesByDay.slice(0, 20).map((day, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{formatDateShort(day.date)}</Text>
                <Text style={styles.tableCell}>{formatCurrency(day.total)}</Text>
                <Text style={styles.tableCell}>{day.orders}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Text style={styles.footer}>
        Generado el {new Date().toLocaleDateString("es-BO")} a las {new Date().toLocaleTimeString("es-BO")}
      </Text>
    </Page>
  </Document>
);

/**
 * Componente PDF para Reporte de Productos
 */
const ProductsReportPDF: React.FC<{ report: ProductsReport }> = ({ report }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Productos Más Vendidos</Text>
      <Text style={{ textAlign: "center", marginBottom: 20 }}>
        {formatDateRange(report.startDate, report.endDate)}
      </Text>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCell}>Producto</Text>
          <Text style={styles.tableCell}>Cantidad</Text>
          <Text style={styles.tableCell}>Ingresos</Text>
          <Text style={styles.tableCell}>%</Text>
        </View>
        {report.products.map((product, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{product.productName}</Text>
            <Text style={styles.tableCell}>{product.quantitySold}</Text>
            <Text style={styles.tableCell}>{formatCurrency(product.totalRevenue)}</Text>
            <Text style={styles.tableCell}>{product.percentage.toFixed(2)}%</Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        Generado el {new Date().toLocaleDateString("es-BO")} a las {new Date().toLocaleTimeString("es-BO")}
      </Text>
    </Page>
  </Document>
);

/**
 * Componente PDF para Reporte de Clientes
 */
const CustomersReportPDF: React.FC<{ report: CustomersReport }> = ({ report }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Mejores Clientes</Text>
      <Text style={{ textAlign: "center", marginBottom: 20 }}>
        {formatDateRange(report.startDate, report.endDate)}
      </Text>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCell}>Cliente</Text>
          <Text style={styles.tableCell}>Órdenes</Text>
          <Text style={styles.tableCell}>Total Gastado</Text>
          <Text style={styles.tableCell}>%</Text>
        </View>
        {report.customers.map((customer, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{customer.customerName}</Text>
            <Text style={styles.tableCell}>{customer.totalOrders}</Text>
            <Text style={styles.tableCell}>{formatCurrency(customer.totalSpent)}</Text>
            <Text style={styles.tableCell}>{customer.percentage.toFixed(2)}%</Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        Generado el {new Date().toLocaleDateString("es-BO")} a las {new Date().toLocaleTimeString("es-BO")}
      </Text>
    </Page>
  </Document>
);

/**
 * Componente PDF para Resumen de Cierres
 */
const CashRegisterSummaryPDF: React.FC<{ report: CashRegisterSummaryReport }> = ({ report }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Resumen de Cierres de Caja</Text>
      <Text style={{ textAlign: "center", marginBottom: 20 }}>
        {formatDateRange(report.startDate, report.endDate)}
      </Text>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, { flex: 0.8 }]}>Fecha</Text>
          <Text style={styles.tableCell}>Ventas</Text>
          <Text style={[styles.tableCell, { flex: 0.6 }]}>Órdenes</Text>
          <Text style={styles.tableCell}>Inicial</Text>
          <Text style={styles.tableCell}>Final</Text>
          <Text style={styles.tableCell}>Diferencia</Text>
          <Text style={[styles.tableCell, { flex: 0.6 }]}>Estado</Text>
        </View>
        {report.days.map((day, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 0.8 }]}>{formatDateShort(day.date)}</Text>
            <Text style={styles.tableCell}>{formatCurrency(day.totalSales)}</Text>
            <Text style={[styles.tableCell, { flex: 0.6 }]}>{day.totalOrders}</Text>
            <Text style={styles.tableCell}>
              {day.openingAmount ? formatCurrency(day.openingAmount) : "N/A"}
            </Text>
            <Text style={styles.tableCell}>
              {day.closingAmount ? formatCurrency(day.closingAmount) : "N/A"}
            </Text>
            <Text style={styles.tableCell}>
              {day.difference ? formatCurrency(day.difference) : "N/A"}
            </Text>
            <Text style={[styles.tableCell, { flex: 0.6 }]}>{day.status}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        Generado el {new Date().toLocaleDateString("es-BO")} a las {new Date().toLocaleTimeString("es-BO")}
      </Text>
    </Page>
  </Document>
);

/**
 * Genera y descarga un PDF para el reporte diario
 */
export const generateDailyReportPDF = async (report: DailyReport): Promise<void> => {
  const doc = <DailyReportPDF report={report} />;
  const blob = await pdf(doc).toBlob();
  saveAs(blob, `Reporte_Diario_${formatDateShort(report.date).replace(/\//g, "_")}.pdf`);
};

/**
 * Genera y descarga un PDF para el reporte de ventas
 */
export const generateSalesReportPDF = async (report: SalesReport): Promise<void> => {
  const doc = <SalesReportPDF report={report} />;
  const blob = await pdf(doc).toBlob();
  saveAs(
    blob,
    `Reporte_Ventas_${formatDateShort(report.startDate).replace(/\//g, "_")}_${formatDateShort(report.endDate).replace(/\//g, "_")}.pdf`
  );
};

/**
 * Genera y descarga un PDF para el reporte de productos
 */
export const generateProductsReportPDF = async (report: ProductsReport): Promise<void> => {
  const doc = <ProductsReportPDF report={report} />;
  const blob = await pdf(doc).toBlob();
  saveAs(
    blob,
    `Reporte_Productos_${formatDateShort(report.startDate).replace(/\//g, "_")}_${formatDateShort(report.endDate).replace(/\//g, "_")}.pdf`
  );
};

/**
 * Genera y descarga un PDF para el reporte de clientes
 */
export const generateCustomersReportPDF = async (report: CustomersReport): Promise<void> => {
  const doc = <CustomersReportPDF report={report} />;
  const blob = await pdf(doc).toBlob();
  saveAs(
    blob,
    `Reporte_Clientes_${formatDateShort(report.startDate).replace(/\//g, "_")}_${formatDateShort(report.endDate).replace(/\//g, "_")}.pdf`
  );
};

/**
 * Genera y descarga un PDF para el resumen de cierres
 */
export const generateCashRegisterSummaryPDF = async (report: CashRegisterSummaryReport): Promise<void> => {
  const doc = <CashRegisterSummaryPDF report={report} />;
  const blob = await pdf(doc).toBlob();
  saveAs(
    blob,
    `Resumen_Cierres_${formatDateShort(report.startDate).replace(/\//g, "_")}_${formatDateShort(report.endDate).replace(/\//g, "_")}.pdf`
  );
};

/**
 * Componente PDF para Reporte Completo del Dashboard
 * Incluye todos los datos: KPIs, ventas por hora, métodos de pago, productos más vendidos, mejores clientes y ventas por día
 */
const CompleteDashboardReportPDF: React.FC<{ report: CompleteDashboardReport }> = ({ report }) => {
  const { salesReport, productsReport, customersReport, sellersReport } = report;
  
  // Calcular número de métodos de pago utilizados
  const paymentMethodsCount = [
    salesReport.salesByPaymentMethod.cash > 0,
    salesReport.salesByPaymentMethod.card > 0,
    salesReport.salesByPaymentMethod.qr > 0,
  ].filter(Boolean).length;

  // Calcular porcentajes de métodos de pago
  const totalSales = salesReport.totalSales;
  const paymentMethods = [
    {
      method: "Efectivo",
      amount: salesReport.salesByPaymentMethod.cash,
      percentage: totalSales > 0 ? (salesReport.salesByPaymentMethod.cash / totalSales) * 100 : 0,
      color: "#22C55E", // green-500
    },
    {
      method: "Tarjeta",
      amount: salesReport.salesByPaymentMethod.card,
      percentage: totalSales > 0 ? (salesReport.salesByPaymentMethod.card / totalSales) * 100 : 0,
      color: "#3B82F6", // blue-500
    },
    {
      method: "QR",
      amount: salesReport.salesByPaymentMethod.qr,
      percentage: totalSales > 0 ? (salesReport.salesByPaymentMethod.qr / totalSales) * 100 : 0,
      color: "#FF8C42", // orange-500
    },
  ];

  // Preparar datos para gráfico de barras por hora
  const hoursWithSales = salesReport.salesByHour.filter((h) => h.total > 0);
  const maxHourSales = Math.max(...hoursWithSales.map((h) => h.total), 1);
  const maxBarHeight = 100; // Altura máxima de las barras en puntos

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header con Logo */}
        <View style={styles.header}>
          <Image
            src="/imagen-corporativa.jpg"
            style={styles.logo}
          />
          <Text style={styles.title}>Reporte Completo de Ventas</Text>
          <Text style={{ textAlign: "center", marginBottom: 20, fontSize: 11 }}>
            {formatDateRange(salesReport.startDate, salesReport.endDate)}
          </Text>
        </View>

        {/* Resumen General (KPIs) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen General</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Total de Ventas:</Text>
            <Text style={styles.value}>{formatCurrency(salesReport.totalSales)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total de Órdenes:</Text>
            <Text style={styles.value}>{salesReport.totalOrders}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Venta Promedio:</Text>
            <Text style={styles.value}>{formatCurrency(salesReport.averageTicket)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Métodos de Pago:</Text>
            <Text style={styles.value}>{paymentMethodsCount}</Text>
          </View>
        </View>

        {/* Ventas por Método de Pago con Gráfico Visual */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ventas por Método de Pago</Text>
          {paymentMethods.map((method, index) => {
            const barWidth = totalSales > 0 ? (method.amount / totalSales) * 100 : 0;
            return (
              <View key={index} style={styles.paymentMethodRow}>
                <Text style={styles.paymentMethodLabel}>{method.method}:</Text>
                <View
                  style={[
                    styles.paymentMethodBar,
                    {
                      width: `${barWidth}%`,
                      backgroundColor: method.color,
                      maxWidth: "200px",
                    },
                  ]}
                />
                <Text style={styles.paymentMethodValue}>{formatCurrency(method.amount)}</Text>
                <Text style={styles.paymentMethodPercentage}>
                  {method.percentage.toFixed(1)}%
                </Text>
              </View>
            );
          })}
          <View style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #e0e0e0" }}>
            <View style={styles.row}>
              <Text style={[styles.label, { fontWeight: "bold" }]}>Total:</Text>
              <Text style={[styles.value, { fontWeight: "bold", color: "#22C55E" }]}>
                {formatCurrency(totalSales)}
              </Text>
            </View>
          </View>
        </View>

        {/* Ventas por Hora con Gráfico de Barras */}
        {hoursWithSales.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ventas por Hora</Text>
            <View style={styles.chartContainer}>
              {/* Gráfico de Barras */}
              <View style={styles.barChart}>
                {hoursWithSales.slice(0, 12).map((hour, index) => {
                  const barHeight = maxHourSales > 0 ? (hour.total / maxHourSales) * maxBarHeight : 0;
                  return (
                    <View key={index} style={{ flex: 1, alignItems: "center", marginHorizontal: 1 }}>
                      <Text style={styles.barValue}>{formatCurrency(hour.total)}</Text>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: Math.max(barHeight, 4),
                            backgroundColor: "#FF8C42",
                          },
                        ]}
                      />
                      <Text style={styles.barLabel}>{hour.hour}:00</Text>
                    </View>
                  );
                })}
              </View>
            </View>
            {/* Tabla de datos */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCell}>Hora</Text>
                <Text style={styles.tableCell}>Total</Text>
                <Text style={styles.tableCell}>Órdenes</Text>
              </View>
              {hoursWithSales.slice(0, 12).map((hour, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{hour.hour}:00</Text>
                  <Text style={styles.tableCell}>{formatCurrency(hour.total)}</Text>
                  <Text style={styles.tableCell}>{hour.orders}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Productos Más Vendidos con Gráfico */}
        {productsReport && productsReport.products.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Productos Más Vendidos</Text>
            {/* Gráfico de barras horizontales */}
            <View style={styles.chartContainer}>
              {productsReport.products.slice(0, 5).map((product, index) => {
                const maxRevenue = Math.max(...productsReport.products.map((p) => p.totalRevenue), 1);
                const barWidth = maxRevenue > 0 ? (product.totalRevenue / maxRevenue) * 100 : 0;
                return (
                  <View key={index} style={{ marginBottom: 12 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                      <Text style={{ fontSize: 8, width: 120, flexShrink: 0 }}>
                        {product.productName.length > 25
                          ? `${product.productName.substring(0, 25)}...`
                          : product.productName}
                      </Text>
                      <View
                        style={{
                          height: 16,
                          backgroundColor: "#3B82F6",
                          borderRadius: 2,
                          width: `${barWidth}%`,
                          maxWidth: "200px",
                          marginLeft: 8,
                          marginRight: 8,
                        }}
                      />
                      <Text style={{ fontSize: 8, fontWeight: "bold", width: 60, textAlign: "right" }}>
                        {formatCurrency(product.totalRevenue)}
                      </Text>
                      <Text style={{ fontSize: 7, color: "#666", width: 40, textAlign: "right", marginLeft: 4 }}>
                        {product.percentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            {/* Tabla de datos */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCell}>Producto</Text>
                <Text style={styles.tableCell}>Cantidad</Text>
                <Text style={styles.tableCell}>Ingresos</Text>
                <Text style={styles.tableCell}>%</Text>
              </View>
              {productsReport.products.slice(0, 10).map((product, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{product.productName}</Text>
                  <Text style={styles.tableCell}>{product.quantitySold}</Text>
                  <Text style={styles.tableCell}>{formatCurrency(product.totalRevenue)}</Text>
                  <Text style={styles.tableCell}>{product.percentage.toFixed(2)}%</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Mejores Clientes con Gráfico */}
        {customersReport && customersReport.customers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mejores Clientes</Text>
            {/* Gráfico de barras horizontales */}
            <View style={styles.chartContainer}>
              {customersReport.customers.slice(0, 5).map((customer, index) => {
                const maxSpent = Math.max(...customersReport.customers.map((c) => c.totalSpent), 1);
                const barWidth = maxSpent > 0 ? (customer.totalSpent / maxSpent) * 100 : 0;
                return (
                  <View key={index} style={{ marginBottom: 12 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                      <Text style={{ fontSize: 8, width: 120, flexShrink: 0 }}>
                        {customer.customerName.length > 25
                          ? `${customer.customerName.substring(0, 25)}...`
                          : customer.customerName}
                      </Text>
                      <View
                        style={{
                          height: 16,
                          backgroundColor: "#8B5CF6",
                          borderRadius: 2,
                          width: `${barWidth}%`,
                          maxWidth: "200px",
                          marginLeft: 8,
                          marginRight: 8,
                        }}
                      />
                      <Text style={{ fontSize: 8, fontWeight: "bold", width: 60, textAlign: "right" }}>
                        {formatCurrency(customer.totalSpent)}
                      </Text>
                      <Text style={{ fontSize: 7, color: "#666", width: 40, textAlign: "right", marginLeft: 4 }}>
                        {customer.percentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            {/* Tabla de datos */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCell}>Cliente</Text>
                <Text style={styles.tableCell}>Órdenes</Text>
                <Text style={styles.tableCell}>Total Gastado</Text>
                <Text style={styles.tableCell}>%</Text>
              </View>
              {customersReport.customers.slice(0, 10).map((customer, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{customer.customerName}</Text>
                  <Text style={styles.tableCell}>{customer.totalOrders}</Text>
                  <Text style={styles.tableCell}>{formatCurrency(customer.totalSpent)}</Text>
                  <Text style={styles.tableCell}>{customer.percentage.toFixed(2)}%</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Ventas por Día */}
        {salesReport.salesByDay.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ventas por Día</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCell}>Fecha</Text>
                <Text style={styles.tableCell}>Total</Text>
                <Text style={styles.tableCell}>Órdenes</Text>
              </View>
              {salesReport.salesByDay.slice(0, 30).map((day, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{formatDateShort(day.date)}</Text>
                  <Text style={styles.tableCell}>{formatCurrency(day.total)}</Text>
                  <Text style={styles.tableCell}>{day.orders}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Rendimiento por Vendedor */}
        {sellersReport && sellersReport.sellers.length > 0 && (
          <View style={styles.section} break>
            <Text style={styles.sectionTitle}>Rendimiento por Vendedor</Text>
            {/* Gráfico de barras horizontales */}
            <View style={styles.chartContainer}>
              {sellersReport.sellers.slice(0, 5).map((seller, index) => {
                const maxSales = Math.max(...sellersReport.sellers.map((s) => s.totalSales), 1);
                const barWidth = maxSales > 0 ? (seller.totalSales / maxSales) * 100 : 0;
                return (
                  <View key={index} style={{ marginBottom: 12 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                      <Text style={{ fontSize: 8, width: 120, flexShrink: 0 }}>
                        {seller.sellerName.length > 25
                          ? `${seller.sellerName.substring(0, 25)}...`
                          : seller.sellerName}
                      </Text>
                      <View
                        style={{
                          height: 16,
                          backgroundColor: "#F59E0B",
                          borderRadius: 2,
                          width: `${barWidth}%`,
                          maxWidth: "200px",
                          marginLeft: 8,
                          marginRight: 8,
                        }}
                      />
                      <Text style={{ fontSize: 8, fontWeight: "bold", width: 60, textAlign: "right" }}>
                        {formatCurrency(seller.totalSales)}
                      </Text>
                      <Text style={{ fontSize: 7, color: "#666", width: 40, textAlign: "right", marginLeft: 4 }}>
                        {seller.percentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            {/* Tabla de datos */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>Vendedor</Text>
                <Text style={styles.tableCell}>Órdenes</Text>
                <Text style={styles.tableCell}>Total Ventas</Text>
                <Text style={styles.tableCell}>Efectivo</Text>
                <Text style={styles.tableCell}>QR</Text>
                <Text style={styles.tableCell}>%</Text>
              </View>
              {sellersReport.sellers.map((seller, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>{seller.sellerName}</Text>
                  <Text style={styles.tableCell}>{seller.totalOrders}</Text>
                  <Text style={styles.tableCell}>{formatCurrency(seller.totalSales)}</Text>
                  <Text style={styles.tableCell}>{formatCurrency(seller.cashTotal)}</Text>
                  <Text style={styles.tableCell}>{formatCurrency(seller.qrTotal)}</Text>
                  <Text style={styles.tableCell}>{seller.percentage.toFixed(2)}%</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.footer}>
          Generado el {new Date().toLocaleDateString("es-BO")} a las {new Date().toLocaleTimeString("es-BO")}
        </Text>
      </Page>
    </Document>
  );
};

/**
 * Genera y descarga un PDF completo del dashboard con todos los datos
 */
export const generateCompleteDashboardPDF = async (report: CompleteDashboardReport): Promise<void> => {
  const doc = <CompleteDashboardReportPDF report={report} />;
  const blob = await pdf(doc).toBlob();
  const startDate = report.salesReport.startDate;
  const endDate = report.salesReport.endDate;
  saveAs(
    blob,
    `Reporte_Completo_${formatDateShort(startDate).replace(/\//g, "_")}_${formatDateShort(endDate).replace(/\//g, "_")}.pdf`
  );
};

