import { describe, it, expect } from "vitest";
import {
  levenshteinDistance,
  stringSimilarity,
  findSimilarNames,
} from "../stringSimilarity";

// ============================================================
// levenshteinDistance
// ============================================================
describe("levenshteinDistance", () => {
  it("debería retornar 0 para cadenas idénticas", () => {
    expect(levenshteinDistance("hamburguesas", "hamburguesas")).toBe(0);
  });

  it("debería retornar la longitud de la otra cadena si una está vacía", () => {
    expect(levenshteinDistance("", "hola")).toBe(4);
    expect(levenshteinDistance("test", "")).toBe(4);
  });

  it("debería retornar 0 para ambas cadenas vacías", () => {
    expect(levenshteinDistance("", "")).toBe(0);
  });

  it("debería calcular distancia correcta para cadenas similares", () => {
    // "Hamburguesass" vs "Hamburguesas" → 1 inserción (la 's' extra)
    expect(levenshteinDistance("Hamburguesass", "Hamburguesas")).toBe(1);
  });

  it("debería calcular distancia correcta para cadenas completamente diferentes", () => {
    expect(levenshteinDistance("abc", "xyz")).toBe(3);
  });

  it("debería manejar sustituciones correctamente", () => {
    // "gato" vs "pato" → 1 sustitución
    expect(levenshteinDistance("gato", "pato")).toBe(1);
  });
});

// ============================================================
// stringSimilarity
// ============================================================
describe("stringSimilarity", () => {
  it("debería retornar 100 para cadenas idénticas", () => {
    expect(stringSimilarity("Hamburguesas", "Hamburguesas")).toBe(100);
  });

  it("debería ser case-insensitive", () => {
    expect(stringSimilarity("HAMBURGUESAS", "hamburguesas")).toBe(100);
  });

  it("debería ignorar espacios al inicio/final", () => {
    expect(stringSimilarity("  Bebidas  ", "Bebidas")).toBe(100);
  });

  it("debería retornar 0 para una cadena vacía", () => {
    expect(stringSimilarity("", "algo")).toBe(0);
    expect(stringSimilarity("algo", "")).toBe(0);
  });

  it("debería retornar alta similitud para cadenas parecidas", () => {
    const similarity = stringSimilarity("Hamburguesass", "Hamburguesas");
    // 12 de 13 caracteres coinciden → ~92%
    expect(similarity).toBeGreaterThan(80);
  });

  it("debería retornar baja similitud para cadenas diferentes", () => {
    const similarity = stringSimilarity("Hamburguesas", "Postres");
    expect(similarity).toBeLessThan(50);
  });
});

// ============================================================
// findSimilarNames
// ============================================================
describe("findSimilarNames", () => {
  const existingNames = ["Hamburguesas", "Bebidas", "Postres", "Combos"];

  it("debería encontrar nombres similares sobre el threshold", () => {
    const matches = findSimilarNames("Hamburguesass", existingNames, 70);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].name).toBe("Hamburguesas");
  });

  it("debería retornar array vacío si no hay similares", () => {
    const matches = findSimilarNames("Ensaladas", existingNames, 70);
    expect(matches).toEqual([]);
  });

  it("debería excluir duplicados exactos (los maneja el backend)", () => {
    const matches = findSimilarNames("Hamburguesas", existingNames, 70);
    // No debería incluir "Hamburguesas" exacto
    const exactMatch = matches.find((m) => m.name === "Hamburguesas");
    expect(exactMatch).toBeUndefined();
  });

  it("debería excluir el nombre actual en modo edición", () => {
    const matches = findSimilarNames(
      "Hamburguesass",
      existingNames,
      70,
      "Hamburguesas", // nombre actual en edición
    );
    const excluded = matches.find((m) => m.name === "Hamburguesas");
    expect(excluded).toBeUndefined();
  });

  it("debería retornar array vacío para nombre vacío", () => {
    const matches = findSimilarNames("", existingNames, 70);
    expect(matches).toEqual([]);
  });

  it("debería ordenar por similitud descendente", () => {
    const names = ["Hamburguesa", "Hamburguesas", "Hamburguesas Dobles"];
    const matches = findSimilarNames("Hamburguesass", names, 50);
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i - 1].similarity).toBeGreaterThanOrEqual(
        matches[i].similarity,
      );
    }
  });
});
