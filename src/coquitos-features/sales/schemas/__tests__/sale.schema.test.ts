import { describe, it, expect } from "vitest";
import { createSaleSchema } from "../sale.schema";

describe("createSaleSchema", () => {
  const validSale = {
    customerId: "550e8400-e29b-41d4-a716-446655440000",
    paymentMethod: "Efectivo" as const,
    amountPaid: "100",
  };

  // ============================================================
  // Validación exitosa
  // ============================================================
  it("debería aceptar una venta válida con Efectivo", () => {
    const result = createSaleSchema.safeParse(validSale);
    expect(result.success).toBe(true);
  });

  it("debería aceptar una venta válida con QR", () => {
    const result = createSaleSchema.safeParse({
      ...validSale,
      paymentMethod: "QR",
    });
    expect(result.success).toBe(true);
  });

  it("debería aceptar venta con notas opcionales", () => {
    const result = createSaleSchema.safeParse({
      ...validSale,
      notes: "Cliente frecuente, aplica descuento",
    });
    expect(result.success).toBe(true);
  });

  // ============================================================
  // Validación de customerId
  // ============================================================
  it("debería rechazar customerId que no sea UUID", () => {
    const result = createSaleSchema.safeParse({
      ...validSale,
      customerId: "no-es-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar customerId vacío", () => {
    const result = createSaleSchema.safeParse({
      ...validSale,
      customerId: "",
    });
    expect(result.success).toBe(false);
  });

  // ============================================================
  // Validación de paymentMethod
  // ============================================================
  it("debería rechazar método de pago inválido", () => {
    const result = createSaleSchema.safeParse({
      ...validSale,
      paymentMethod: "Tarjeta",
    });
    expect(result.success).toBe(false);
  });

  // ============================================================
  // Validación de amountPaid
  // ============================================================
  it("debería rechazar amountPaid vacío", () => {
    const result = createSaleSchema.safeParse({
      ...validSale,
      amountPaid: "",
    });
    expect(result.success).toBe(false);
  });

  // ============================================================
  // Validación de notes
  // ============================================================
  it("debería rechazar notas con más de 500 caracteres", () => {
    const result = createSaleSchema.safeParse({
      ...validSale,
      notes: "A".repeat(501),
    });
    expect(result.success).toBe(false);
  });
});
