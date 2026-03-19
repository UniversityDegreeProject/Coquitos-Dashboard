import { memo, useState, useEffect, useCallback } from "react";
import {
  X,
  User,
  Calendar,
  ShoppingCart,
  Banknote,
  Smartphone,
  Package,
  ChevronDown,
  ChevronUp,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useTheme } from "@/shared/hooks/useTheme";
import { formatCurrency } from "@/shared/reports";
import { getSales } from "@/coquitos-features/sales/services/sale.service";
import type { Sale } from "@/coquitos-features/sales/interfaces";
import type { SellerReportItem } from "@/shared/reports";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Image,
} from "@react-pdf/renderer";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface SellerSalesDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: SellerReportItem | null;
  startDate: string;
  endDate: string;
}

// Estilos para PDF del vendedor individual
const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: "Helvetica" },
  header: { marginBottom: 20, alignItems: "center" },
  logo: { width: 120, height: 80, marginBottom: 10, objectFit: "contain" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 5, textAlign: "center" },
  subtitle: { fontSize: 12, textAlign: "center", marginBottom: 15, color: "#555" },
  dateRange: { fontSize: 10, textAlign: "center", marginBottom: 20, color: "#777" },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 10, borderBottom: "1px solid #000", paddingBottom: 5 },
  row: { flexDirection: "row", marginBottom: 5 },
  label: { width: "50%", fontWeight: "bold" },
  value: { width: "50%" },
  table: { marginTop: 10 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f0f0f0", padding: 8, fontWeight: "bold" },
  tableRow: { flexDirection: "row", padding: 8, borderBottom: "1px solid #e0e0e0" },
  tableCell: { flex: 1 },
  productRow: { flexDirection: "row", padding: 4, paddingLeft: 20, backgroundColor: "#fafafa" },
  productCell: { flex: 1, fontSize: 8, color: "#555" },
  footer: { marginTop: 30, fontSize: 8, textAlign: "center", color: "#666" },
});

// Formatear fecha para display
const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

// Formatear fecha de venta
const formatSaleDate = (date: Date | string | undefined) => {
  if (!date) return "-";
  try {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es });
  } catch {
    return "-";
  }
};

// Componente PDF para reporte individual de vendedor
// eslint-disable-next-line react-refresh/only-export-components
const SellerIndividualReportPDF = ({
  seller,
  sales,
  startDate,
  endDate,
}: {
  seller: SellerReportItem;
  sales: Sale[];
  startDate: string;
  endDate: string;
}) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* Header con Logo */}
      <View style={pdfStyles.header}>
        <Image src="/imagen-corporativa.jpg" style={pdfStyles.logo} />
        <Text style={pdfStyles.title}>Reporte de Ventas por Vendedor</Text>
        <Text style={pdfStyles.subtitle}>{seller.sellerName} (@{seller.username})</Text>
        <Text style={pdfStyles.dateRange}>
          {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
        </Text>
      </View>

      {/* Resumen */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Resumen del Vendedor</Text>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Total de Ventas:</Text>
          <Text style={pdfStyles.value}>{formatCurrency(seller.totalSales)}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Total de Órdenes:</Text>
          <Text style={pdfStyles.value}>{seller.totalOrders}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Efectivo:</Text>
          <Text style={pdfStyles.value}>{formatCurrency(seller.cashTotal)}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>QR:</Text>
          <Text style={pdfStyles.value}>{formatCurrency(seller.qrTotal)}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Participación:</Text>
          <Text style={pdfStyles.value}>{seller.percentage.toFixed(2)}%</Text>
        </View>
      </View>

      {/* Tabla de Ventas */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Detalle de Ventas ({sales.length})</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeader}>
            <Text style={[pdfStyles.tableCell, { flex: 1.2 }]}>N° Venta</Text>
            <Text style={pdfStyles.tableCell}>Fecha</Text>
            <Text style={[pdfStyles.tableCell, { flex: 1.3 }]}>Cliente</Text>
            <Text style={[pdfStyles.tableCell, { flex: 0.8 }]}>Pago</Text>
            <Text style={pdfStyles.tableCell}>Total</Text>
          </View>
          {sales.map((sale, index) => (
            <View key={index}>
              <View style={pdfStyles.tableRow}>
                <Text style={[pdfStyles.tableCell, { flex: 1.2 }]}>#{sale.saleNumber}</Text>
                <Text style={pdfStyles.tableCell}>{formatSaleDate(sale.createdAt)}</Text>
                <Text style={[pdfStyles.tableCell, { flex: 1.3 }]}>
                  {sale.customer ? `${sale.customer.firstName} ${sale.customer.lastName}` : "N/A"}
                </Text>
                <Text style={[pdfStyles.tableCell, { flex: 0.8 }]}>{sale.paymentMethod}</Text>
                <Text style={pdfStyles.tableCell}>{formatCurrency(sale.total)}</Text>
              </View>
              {/* Productos de la venta */}
              {sale.items && sale.items.length > 0 && sale.items.map((item, itemIndex) => (
                <View key={itemIndex} style={pdfStyles.productRow}>
                  <Text style={[pdfStyles.productCell, { flex: 1.2 }]}>  ↳</Text>
                  <Text style={[pdfStyles.productCell, { flex: 2.3 }]}>
                    {item.quantity}x {item.product?.name || "Producto"}
                  </Text>
                  <Text style={[pdfStyles.productCell, { flex: 0.8 }]}>
                    {formatCurrency(item.unitPrice)} c/u
                  </Text>
                  <Text style={pdfStyles.productCell}>{formatCurrency(item.total)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>

      <Text style={pdfStyles.footer}>
        Generado el {new Date().toLocaleDateString("es-BO")} a las{" "}
        {new Date().toLocaleTimeString("es-BO")}
      </Text>
    </Page>
  </Document>
);

/**
 * Modal para ver las ventas detalladas de un vendedor
 */
export const SellerSalesDetailModal = memo(
  ({
    isOpen,
    onClose,
    seller,
    startDate,
    endDate,
  }: SellerSalesDetailModalProps) => {
    const { isDark, colors } = useTheme();
    const [sales, setSales] = useState<Sale[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedSales, setExpandedSales] = useState<Set<string>>(new Set());
    const [isExporting, setIsExporting] = useState(false);

    // Cargar ventas del vendedor
    useEffect(() => {
      const fetchSales = async () => {
        if (!isOpen || !seller || !startDate || !endDate) return;

        setIsLoading(true);
        try {
          // Parsear las fechas correctamente para evitar problemas de timezone
          const startDateTime = new Date(startDate + "T00:00:00");
          const endDateTime = new Date(endDate + "T23:59:59");

          const response = await getSales({
            userId: seller.userId,
            startDate: startDateTime,
            endDate: endDateTime,
            status: "Completado",
            page: 1,
            limit: 100,
          });
          setSales(response.data || []);
        } catch (error) {
          console.error("Error fetching seller sales:", error);
          setSales([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSales();
    }, [isOpen, seller, startDate, endDate]);

    // Toggle expand sale
    const toggleExpand = (saleId: string) => {
      setExpandedSales((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(saleId)) {
          newSet.delete(saleId);
        } else {
          newSet.add(saleId);
        }
        return newSet;
      });
    };

    // Exportar PDF individual del vendedor
    const handleExportPDF = useCallback(async () => {
      if (!seller || sales.length === 0) return;
      setIsExporting(true);
      try {
        const doc = (
          <SellerIndividualReportPDF
            seller={seller}
            sales={sales}
            startDate={startDate}
            endDate={endDate}
          />
        );
        const blob = await pdf(doc).toBlob();
        saveAs(
          blob,
          `Reporte_${seller.sellerName.replace(/\s+/g, "_")}_${formatDisplayDate(startDate).replace(/\//g, "_")}_${formatDisplayDate(endDate).replace(/\//g, "_")}.pdf`
        );
      } catch (error) {
        console.error("Error al generar PDF:", error);
      } finally {
        setIsExporting(false);
      }
    }, [seller, sales, startDate, endDate]);

    // Exportar Excel individual del vendedor
    const handleExportExcel = useCallback(async () => {
      if (!seller || sales.length === 0) return;
      setIsExporting(true);
      try {
        const workbook = new ExcelJS.Workbook();

        // Cargar logo
        let logoId: number | undefined;
        try {
          const logoResponse = await fetch("/imagen-corporativa.jpg");
          if (logoResponse.ok) {
            const logoBuffer = await logoResponse.arrayBuffer();
            const buffer = new Uint8Array(logoBuffer);
            logoId = workbook.addImage({
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              buffer: buffer as any,
              extension: "jpeg",
            });
          }
        } catch {
          console.warn("No se pudo cargar el logo");
        }

        // Hoja 1: Resumen
        const summarySheet = workbook.addWorksheet("Resumen");
        summarySheet.columns = [{ width: 25 }, { width: 25 }];

        let row = 1;
        if (logoId !== undefined) {
          summarySheet.addImage(logoId, {
            tl: { col: 0, row: 0 },
            ext: { width: 200, height: 100 },
          });
          row += 5;
        }

        summarySheet.mergeCells(`A${row}:B${row}`);
        const titleCell = summarySheet.getCell(`A${row}`);
        titleCell.value = `Reporte de Ventas - ${seller.sellerName}`;
        titleCell.font = { size: 16, bold: true };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        row += 1;

        summarySheet.mergeCells(`A${row}:B${row}`);
        const dateCell = summarySheet.getCell(`A${row}`);
        dateCell.value = `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
        dateCell.alignment = { horizontal: "center" };
        dateCell.font = { color: { argb: "FF666666" } };
        row += 2;

        const summaryData = [
          ["Vendedor:", seller.sellerName],
          ["Usuario:", `@${seller.username}`],
          ["Total de Ventas:", formatCurrency(seller.totalSales)],
          ["Total de Órdenes:", seller.totalOrders.toString()],
          ["Efectivo:", formatCurrency(seller.cashTotal)],
          ["QR:", formatCurrency(seller.qrTotal)],
          ["Participación:", `${seller.percentage.toFixed(2)}%`],
        ];

        summaryData.forEach(([label, value]) => {
          summarySheet.getCell(`A${row}`).value = label;
          summarySheet.getCell(`A${row}`).font = { bold: true };
          summarySheet.getCell(`B${row}`).value = value;
          row++;
        });

        // Hoja 2: Detalle de Ventas
        const detailSheet = workbook.addWorksheet("Detalle de Ventas");
        detailSheet.columns = [
          { width: 18 },
          { width: 20 },
          { width: 25 },
          { width: 15 },
          { width: 15 },
          { width: 30 },
          { width: 12 },
          { width: 15 },
        ];

        let detailRow = 1;
        if (logoId !== undefined) {
          detailSheet.addImage(logoId, {
            tl: { col: 0, row: 0 },
            ext: { width: 200, height: 100 },
          });
          detailRow += 5;
        }

        detailSheet.mergeCells(`A${detailRow}:H${detailRow}`);
        const detailTitle = detailSheet.getCell(`A${detailRow}`);
        detailTitle.value = `Detalle de Ventas - ${seller.sellerName} (${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)})`;
        detailTitle.font = { size: 14, bold: true };
        detailTitle.alignment = { horizontal: "center", vertical: "middle" };
        detailRow += 2;

        // Headers
        const headers = ["N° Venta", "Fecha", "Cliente", "Pago", "Total Venta", "Producto", "Cantidad", "Subtotal"];
        headers.forEach((header, i) => {
          const col = String.fromCharCode(65 + i);
          const cell = detailSheet.getCell(`${col}${detailRow}`);
          cell.value = header;
          cell.font = { bold: true };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } };
        });
        detailRow++;

        // Data rows — una fila por producto de cada venta
        sales.forEach((sale) => {
          const customerName = sale.customer
            ? `${sale.customer.firstName} ${sale.customer.lastName}`
            : "N/A";

          if (sale.items && sale.items.length > 0) {
            sale.items.forEach((item, itemIndex) => {
              detailSheet.getCell(`A${detailRow}`).value = itemIndex === 0 ? `#${sale.saleNumber}` : "";
              detailSheet.getCell(`B${detailRow}`).value = itemIndex === 0 ? formatSaleDate(sale.createdAt) : "";
              detailSheet.getCell(`C${detailRow}`).value = itemIndex === 0 ? customerName : "";
              detailSheet.getCell(`D${detailRow}`).value = itemIndex === 0 ? sale.paymentMethod : "";
              detailSheet.getCell(`E${detailRow}`).value = itemIndex === 0 ? Number(sale.total) : "";
              detailSheet.getCell(`F${detailRow}`).value = item.product?.name || "Producto";
              detailSheet.getCell(`G${detailRow}`).value = item.quantity;
              detailSheet.getCell(`H${detailRow}`).value = Number(item.total);

              if (itemIndex === 0 && Number(sale.total) > 0) {
                detailSheet.getCell(`E${detailRow}`).font = { bold: true };
              }
              detailRow++;
            });
          } else {
            // Venta sin items detallados
            detailSheet.getCell(`A${detailRow}`).value = `#${sale.saleNumber}`;
            detailSheet.getCell(`B${detailRow}`).value = formatSaleDate(sale.createdAt);
            detailSheet.getCell(`C${detailRow}`).value = customerName;
            detailSheet.getCell(`D${detailRow}`).value = sale.paymentMethod;
            detailSheet.getCell(`E${detailRow}`).value = Number(sale.total);
            detailSheet.getCell(`E${detailRow}`).font = { bold: true };
            detailRow++;
          }
        });

        // Descargar
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(
          blob,
          `Reporte_${seller.sellerName.replace(/\s+/g, "_")}_${formatDisplayDate(startDate).replace(/\//g, "_")}_${formatDisplayDate(endDate).replace(/\//g, "_")}.xlsx`
        );
      } catch (error) {
        console.error("Error al generar Excel:", error);
      } finally {
        setIsExporting(false);
      }
    }, [seller, sales, startDate, endDate]);

    if (!isOpen || !seller) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div
          className={`${
            isDark
              ? "bg-[#1E293B] border-[#334155]"
              : "bg-white border-gray-200"
          } rounded-2xl border max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-6 border-b ${
              isDark ? "border-[#334155]" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isDark ? "bg-blue-900/30" : "bg-blue-100"
                }`}
              >
                <User
                  className={`w-6 h-6 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${colors.text.primary}`}>
                  {seller.sellerName}
                </h2>
                <p className={`text-sm ${colors.text.muted}`}>
                  @{seller.username} • {seller.totalOrders} ventas
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? "hover:bg-[#334155]" : "hover:bg-gray-100"
              }`}
            >
              <X className={`w-6 h-6 ${colors.text.primary}`} />
            </button>
          </div>

          {/* Summary Bar */}
          <div
            className={`px-6 py-4 border-b ${
              isDark
                ? "border-[#334155] bg-[#0F172A]"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Calendar className={`w-4 h-4 ${colors.text.muted}`} />
                  <span className={`text-sm ${colors.text.muted}`}>
                    {formatDisplayDate(startDate)} -{" "}
                    {formatDisplayDate(endDate)}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2 sm:mt-0">
                <div className="flex items-center gap-2">
                  <Banknote
                    className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`}
                  />
                  <span className={`text-sm ${colors.text.primary}`}>
                    Efectivo:{" "}
                    <span className="font-semibold">
                      {formatCurrency(seller.cashTotal)}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone
                    className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`}
                  />
                  <span className={`text-sm ${colors.text.primary}`}>
                    QR:{" "}
                    <span className="font-semibold">
                      {formatCurrency(seller.qrTotal)}
                    </span>
                  </span>
                </div>
                <div
                  className={`font-bold text-lg ${isDark ? "text-green-400" : "text-green-600"}`}
                >
                  Total: {formatCurrency(seller.totalSales)}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className={`ml-3 ${colors.text.muted}`}>
                  Cargando ventas...
                </span>
              </div>
            ) : sales.length === 0 ? (
              <div className={`text-center py-12 ${colors.text.muted}`}>
                No se encontraron ventas para este vendedor en el período
                seleccionado
              </div>
            ) : (
              <div className="space-y-3">
                {sales.map((sale) => {
                  const isExpanded = expandedSales.has(sale.id || "");

                  return (
                    <div
                      key={sale.id}
                      className={`rounded-lg border transition-all ${
                        isDark
                          ? "bg-slate-700/50 border-slate-600"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      {/* Sale Header (clickable) */}
                      <button
                        onClick={() => toggleExpand(sale.id || "")}
                        className={`w-full p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-left transition-colors gap-4 ${
                          isDark ? "hover:bg-slate-700" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isDark ? "bg-blue-900/30" : "bg-blue-100"
                            }`}
                          >
                            <ShoppingCart
                              className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                            />
                          </div>
                          <div>
                            <p
                              className={`font-semibold ${colors.text.primary}`}
                            >
                              #{sale.saleNumber}
                            </p>
                            <p className={`text-sm ${colors.text.muted}`}>
                              {sale.createdAt &&
                                format(
                                  new Date(sale.createdAt),
                                  "dd/MM/yyyy HH:mm",
                                  { locale: es },
                                )}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
                          {/* Cliente */}
                          <div className="text-left sm:text-right">
                            <p className={`text-sm ${colors.text.muted}`}>
                              Cliente
                            </p>
                            <p className={`font-medium ${colors.text.primary}`}>
                              {sale.customer
                                ? `${sale.customer.firstName} ${sale.customer.lastName}`
                                : "N/A"}
                            </p>
                          </div>

                          {/* Método de pago */}
                          <div className="flex items-center gap-2">
                            {sale.paymentMethod === "Efectivo" ? (
                              <Banknote
                                className={`w-5 h-5 ${isDark ? "text-green-400" : "text-green-600"}`}
                              />
                            ) : (
                              <Smartphone
                                className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`}
                              />
                            )}
                            <span className={`text-sm ${colors.text.muted}`}>
                              {sale.paymentMethod}
                            </span>
                          </div>

                          {/* Total */}
                          <div
                            className={`font-bold ${isDark ? "text-green-400" : "text-green-600"}`}
                          >
                            {formatCurrency(sale.total)}
                          </div>

                          {/* Expand icon */}
                          {isExpanded ? (
                            <ChevronUp
                              className={`w-5 h-5 ${colors.text.muted}`}
                            />
                          ) : (
                            <ChevronDown
                              className={`w-5 h-5 ${colors.text.muted}`}
                            />
                          )}
                        </div>
                      </button>

                      {/* Expanded Content - Products */}
                      {isExpanded && sale.items && sale.items.length > 0 && (
                        <div
                          className={`px-4 pb-4 border-t ${
                            isDark ? "border-slate-600" : "border-gray-200"
                          }`}
                        >
                          <div className="pt-4">
                            <p
                              className={`text-sm font-semibold mb-2 ${colors.text.muted}`}
                            >
                              <Package className="w-4 h-4 inline mr-1" />
                              Productos ({sale.items.length})
                            </p>
                            <div className="space-y-2">
                              {sale.items.map((item, index) => (
                                <div
                                  key={item.id || index}
                                  className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                                    isDark ? "bg-slate-800/50" : "bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                        isDark
                                          ? "bg-slate-600 text-gray-300"
                                          : "bg-gray-200 text-gray-600"
                                      }`}
                                    >
                                      {item.quantity}
                                    </span>
                                    <span className={`${colors.text.primary}`}>
                                      {item.product?.name || "Producto"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span
                                      className={`text-sm ${colors.text.muted}`}
                                    >
                                      {formatCurrency(item.unitPrice)} c/u
                                    </span>
                                    <span
                                      className={`font-medium ${colors.text.primary}`}
                                    >
                                      {formatCurrency(item.total)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer con botones de exportación */}
          <div
            className={`flex flex-col sm:flex-row justify-between items-center gap-3 p-6 border-t ${
              isDark ? "border-[#334155]" : "border-gray-200"
            }`}
          >
            {/* Botones de exportación */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPDF}
                disabled={isLoading || sales.length === 0 || isExporting}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  !isLoading && sales.length > 0 && !isExporting
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : isDark
                      ? "bg-slate-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>PDF</span>
              </button>
              <button
                onClick={handleExportExcel}
                disabled={isLoading || sales.length === 0 || isExporting}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  !isLoading && sales.length > 0 && !isExporting
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : isDark
                      ? "bg-slate-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel</span>
              </button>
              {isExporting && (
                <span className={`text-sm ${colors.text.muted}`}>
                  Generando...
                </span>
              )}
            </div>

            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                isDark
                  ? "bg-[#334155] text-white hover:bg-[#475569]"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  },
);

SellerSalesDetailModal.displayName = "SellerSalesDetailModal";

