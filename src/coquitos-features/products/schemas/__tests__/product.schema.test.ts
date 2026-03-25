import { describe, it, expect } from "vitest";
import { productSchema } from "../product.schema";

describe("productSchema", () => {
  // ============================================================
  // Producto normal (no variable) — datos válidos
  // ============================================================
  const validNormalProduct = {
    name: "Chorizo Clásico",
    price: "18.50",
    sku: "CHO-CLA-001",
    stock: "10",
    minStock: "5",
    image: "data:image/png;base64,iVBORw0KGgo=",
    categoryId: "550e8400-e29b-41d4-a716-446655440000",
    status: "Disponible" as const,
    isVariableWeight: false,
  };

  it("debería aceptar un producto normal válido", () => {
    const result = productSchema.safeParse(validNormalProduct);
    expect(result.success).toBe(true);
  });

  // ============================================================
  // Validaciones de nombre
  // ============================================================
  it("debería rechazar nombre vacío", () => {
    const result = productSchema.safeParse({ ...validNormalProduct, name: "" });
    expect(result.success).toBe(false);
  });

  it("debería rechazar nombre mayor a 100 caracteres", () => {
    const result = productSchema.safeParse({
      ...validNormalProduct,
      name: "A".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  // ============================================================
  // Validaciones de precio (producto normal)
  // ============================================================
  it("debería rechazar precio vacío en producto normal", () => {
    const result = productSchema.safeParse({
      ...validNormalProduct,
      price: "",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar precio negativo", () => {
    const result = productSchema.safeParse({
      ...validNormalProduct,
      price: "-5",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar precio con más de 2 decimales", () => {
    const result = productSchema.safeParse({
      ...validNormalProduct,
      price: "18.555",
    });
    expect(result.success).toBe(false);
  });

  it("debería aceptar precio con 2 decimales", () => {
    const result = productSchema.safeParse({
      ...validNormalProduct,
      price: "18.50",
    });
    expect(result.success).toBe(true);
  });

  // ============================================================
  // Validaciones de stock (producto normal)
  // ============================================================
  it("debería rechazar stock vacío en producto normal", () => {
    const result = productSchema.safeParse({
      ...validNormalProduct,
      stock: "",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar stock negativo", () => {
    const result = productSchema.safeParse({
      ...validNormalProduct,
      stock: "-1",
    });
    expect(result.success).toBe(false);
  });

  // ============================================================
  // Validaciones de minStock
  // ============================================================
  it("debería rechazar minStock negativo", () => {
    const result = productSchema.safeParse({
      ...validNormalProduct,
      minStock: "-1",
    });
    expect(result.success).toBe(false);
  });

  // ============================================================
  // Validaciones de imagen
  // ============================================================
  it("debería aceptar imagen base64", () => {
    const result = productSchema.safeParse({
      ...validNormalProduct,
      image: "data:image/png;base64,iVBORw0KGgo=",
    });
    expect(result.success).toBe(true);
  });

  it("debería aceptar imagen URL", () => {
    const result = productSchema.safeParse({
      ...validNormalProduct,
      image: "https://example.com/image.png",
    });
    expect(result.success).toBe(true);
  });

  it("debería rechazar imagen vacía", () => {
    const result = productSchema.safeParse({
      ...validNormalProduct,
      image: "",
    });
    expect(result.success).toBe(false);
  });

  // ============================================================
  // Producto de peso variable
  // ============================================================
  const validVariableProduct = {
    name: "Carne de Res",
    sku: "CAR-RES-001",
    minStock: "2",
    image: "data:image/png;base64,iVBORw0KGgo=",
    categoryId: "550e8400-e29b-41d4-a716-446655440000",
    status: "Disponible" as const,
    isVariableWeight: true,
    pricePerKg: "50.00",
  };

  it("debería aceptar un producto de peso variable válido", () => {
    const result = productSchema.safeParse(validVariableProduct);
    expect(result.success).toBe(true);
  });

  it("debería rechazar producto variable sin pricePerKg", () => {
    const result = productSchema.safeParse({
      ...validVariableProduct,
      pricePerKg: "",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar producto variable con pricePerKg negativo", () => {
    const result = productSchema.safeParse({
      ...validVariableProduct,
      pricePerKg: "-10",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar producto variable con pricePerKg de más de 2 decimales", () => {
    const result = productSchema.safeParse({
      ...validVariableProduct,
      pricePerKg: "50.999",
    });
    expect(result.success).toBe(false);
  });

  // ============================================================
  // Validación de status
  // ============================================================
  it("debería aceptar status 'Disponible'", () => {
    const result = productSchema.safeParse(validNormalProduct);
    expect(result.success).toBe(true);
  });

  it("debería rechazar status inválido", () => {
    const result = productSchema.safeParse({
      ...validNormalProduct,
      status: "Eliminado",
    });
    expect(result.success).toBe(false);
  });

  // ============================================================
  // Validación de categoryId
  // ============================================================
  it("debería rechazar categoryId que no sea UUID", () => {
    const result = productSchema.safeParse({
      ...validNormalProduct,
      categoryId: "no-es-uuid",
    });
    expect(result.success).toBe(false);
  });
});
