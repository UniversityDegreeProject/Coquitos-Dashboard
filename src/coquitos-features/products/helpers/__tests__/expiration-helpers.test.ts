import { describe, it, expect } from "vitest";
import {
  getDaysUntilExpiration,
  formatExpirationDate,
  isProductNearExpiration,
  isProductExpiredOrExpiringToday,
  isProductExpiringSoon,
} from "../expiration-helpers";
import type { Product } from "../../interfaces";

/**
 * Helper: crea una fecha ISO en el futuro o pasado relativa a hoy
 */
const daysFromNow = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}T00:00:00.000Z`;
};

/**
 * Helper: crea un producto base para tests
 */
const createProduct = (overrides: Partial<Product> = {}): Product => ({
  id: "test-id",
  name: "Test Product",
  description: "Test",
  price: 10,
  sku: "TST-001",
  stock: 10,
  minStock: 5,
  image: "",
  ingredients: "",
  categoryId: "cat-id",
  status: "Disponible",
  isVariableWeight: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// ============================================================
// getDaysUntilExpiration
// ============================================================
describe("getDaysUntilExpiration", () => {
  it("debería retornar null para null o undefined", () => {
    expect(getDaysUntilExpiration(null)).toBeNull();
    expect(getDaysUntilExpiration(undefined)).toBeNull();
  });

  it("debería retornar 0 para fecha de hoy", () => {
    const today = daysFromNow(0);
    expect(getDaysUntilExpiration(today)).toBe(0);
  });

  it("debería retornar valor positivo para fecha futura", () => {
    const future = daysFromNow(5);
    expect(getDaysUntilExpiration(future)).toBe(5);
  });

  it("debería retornar valor negativo para fecha pasada", () => {
    const past = daysFromNow(-3);
    expect(getDaysUntilExpiration(past)).toBe(-3);
  });

  it("debería manejar string ISO con formato YYYY-MM-DD", () => {
    const result = getDaysUntilExpiration(daysFromNow(10));
    expect(result).toBe(10);
  });

  it("debería retornar null para fecha inválida", () => {
    expect(getDaysUntilExpiration("fecha-invalida")).toBeNull();
  });
});

// ============================================================
// formatExpirationDate
// ============================================================
describe("formatExpirationDate", () => {
  it("debería retornar string vacío para null o undefined", () => {
    expect(formatExpirationDate(null)).toBe("");
    expect(formatExpirationDate(undefined)).toBe("");
  });

  it("debería formatear string ISO a DD/MM/YYYY", () => {
    expect(formatExpirationDate("2024-12-25T00:00:00.000Z")).toBe(
      "25/12/2024",
    );
  });

  it("debería formatear fecha sin timezone correctamente", () => {
    expect(formatExpirationDate("2025-01-15")).toBe("15/01/2025");
  });
});

// ============================================================
// isProductNearExpiration (2-4 días)
// ============================================================
describe("isProductNearExpiration", () => {
  it("debería retornar true para producto que vence en 2 días", () => {
    const product = createProduct({ expirationDate: daysFromNow(2) });
    expect(isProductNearExpiration(product)).toBe(true);
  });

  it("debería retornar true para producto que vence en 3 días", () => {
    const product = createProduct({ expirationDate: daysFromNow(3) });
    expect(isProductNearExpiration(product)).toBe(true);
  });

  it("debería retornar true para producto que vence en 4 días", () => {
    const product = createProduct({ expirationDate: daysFromNow(4) });
    expect(isProductNearExpiration(product)).toBe(true);
  });

  it("debería retornar false para producto que vence mañana (1 día)", () => {
    const product = createProduct({ expirationDate: daysFromNow(1) });
    expect(isProductNearExpiration(product)).toBe(false);
  });

  it("debería retornar false para producto que vence hoy (0 días)", () => {
    const product = createProduct({ expirationDate: daysFromNow(0) });
    expect(isProductNearExpiration(product)).toBe(false);
  });

  it("debería retornar false para producto sin fecha de vencimiento", () => {
    const product = createProduct({ expirationDate: undefined });
    expect(isProductNearExpiration(product)).toBe(false);
  });

  it("debería retornar false para producto que vence en 10 días", () => {
    const product = createProduct({ expirationDate: daysFromNow(10) });
    expect(isProductNearExpiration(product)).toBe(false);
  });
});

// ============================================================
// isProductExpiredOrExpiringToday
// ============================================================
describe("isProductExpiredOrExpiringToday", () => {
  it("debería retornar true para producto que vence hoy", () => {
    const product = createProduct({ expirationDate: daysFromNow(0) });
    expect(isProductExpiredOrExpiringToday(product)).toBe(true);
  });

  it("debería retornar true para producto ya vencido", () => {
    const product = createProduct({ expirationDate: daysFromNow(-5) });
    expect(isProductExpiredOrExpiringToday(product)).toBe(true);
  });

  it("debería retornar false para producto que vence mañana", () => {
    const product = createProduct({ expirationDate: daysFromNow(1) });
    expect(isProductExpiredOrExpiringToday(product)).toBe(false);
  });

  it("debería retornar false para producto sin fecha de vencimiento", () => {
    const product = createProduct({ expirationDate: undefined });
    expect(isProductExpiredOrExpiringToday(product)).toBe(false);
  });
});

// ============================================================
// isProductExpiringSoon (0-4 días)
// ============================================================
describe("isProductExpiringSoon", () => {
  it("debería retornar true para producto que vence hoy", () => {
    const product = createProduct({ expirationDate: daysFromNow(0) });
    expect(isProductExpiringSoon(product)).toBe(true);
  });

  it("debería retornar true para producto que vence en 4 días", () => {
    const product = createProduct({ expirationDate: daysFromNow(4) });
    expect(isProductExpiringSoon(product)).toBe(true);
  });

  it("debería retornar false para producto que vence en 5 días", () => {
    const product = createProduct({ expirationDate: daysFromNow(5) });
    expect(isProductExpiringSoon(product)).toBe(false);
  });

  it("debería retornar false para producto ya vencido", () => {
    const product = createProduct({ expirationDate: daysFromNow(-1) });
    expect(isProductExpiringSoon(product)).toBe(false);
  });
});
