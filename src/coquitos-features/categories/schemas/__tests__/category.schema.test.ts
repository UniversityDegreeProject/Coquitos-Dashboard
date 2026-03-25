import { describe, it, expect } from "vitest";
import { createCategorySchema } from "../category.schema";

describe("createCategorySchema", () => {
  const validCategory = {
    name: "Hamburguesas",
    description: "Categoría de hamburguesas variadas del sistema",
    status: "Activo" as const,
  };

  // ============================================================
  // Validación exitosa
  // ============================================================
  it("debería aceptar datos válidos", () => {
    const result = createCategorySchema.safeParse(validCategory);
    expect(result.success).toBe(true);
  });

  it("debería aceptar con id opcional (UUID)", () => {
    const result = createCategorySchema.safeParse({
      ...validCategory,
      id: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  // ============================================================
  // Validación de nombre
  // ============================================================
  it("debería rechazar nombre con menos de 3 caracteres", () => {
    const result = createCategorySchema.safeParse({
      ...validCategory,
      name: "AB",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar nombre con más de 50 caracteres", () => {
    const result = createCategorySchema.safeParse({
      ...validCategory,
      name: "A" + "a".repeat(50),
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar nombre que no comience con mayúscula", () => {
    const result = createCategorySchema.safeParse({
      ...validCategory,
      name: "hamburguesas",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar nombre con números", () => {
    const result = createCategorySchema.safeParse({
      ...validCategory,
      name: "Hamburguesas123",
    });
    expect(result.success).toBe(false);
  });

  // ============================================================
  // Validación de descripción
  // ============================================================
  it("debería rechazar descripción con menos de 10 caracteres", () => {
    const result = createCategorySchema.safeParse({
      ...validCategory,
      description: "Corta",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar descripción con más de 200 caracteres", () => {
    const result = createCategorySchema.safeParse({
      ...validCategory,
      description: "A".repeat(201),
    });
    expect(result.success).toBe(false);
  });

  // ============================================================
  // Validación de estado
  // ============================================================
  it("debería aceptar estado 'Activo'", () => {
    const result = createCategorySchema.safeParse({
      ...validCategory,
      status: "Activo",
    });
    expect(result.success).toBe(true);
  });

  it("debería aceptar estado 'Inactivo'", () => {
    const result = createCategorySchema.safeParse({
      ...validCategory,
      status: "Inactivo",
    });
    expect(result.success).toBe(true);
  });

  it("debería rechazar estado inválido", () => {
    const result = createCategorySchema.safeParse({
      ...validCategory,
      status: "Eliminado",
    });
    expect(result.success).toBe(false);
  });
});
