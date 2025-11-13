import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
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
 * Servicio para generar reportes en formato PDF
 * Única fuente de verdad para la generación de archivos PDF
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
          <Text style={styles.label}>Ticket Promedio:</Text>
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
          <Text style={styles.label}>Ticket Promedio:</Text>
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

