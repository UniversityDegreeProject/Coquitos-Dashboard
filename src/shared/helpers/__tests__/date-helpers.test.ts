import { describe, it, expect } from "vitest";
import { getTodayDateKey, getTodayRange } from "../date-helpers";

// ============================================================
// getTodayDateKey
// ============================================================
describe("getTodayDateKey", () => {
  it("debería retornar un string con formato YYYY-MM-DD", () => {
    const key = getTodayDateKey();
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("debería corresponder a la fecha actual", () => {
    const key = getTodayDateKey();
    const today = new Date();
    const expected = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    expect(key).toBe(expected);
  });
});

// ============================================================
// getTodayRange
// ============================================================
describe("getTodayRange", () => {
  it("debería retornar startDate y endDate", () => {
    const range = getTodayRange();
    expect(range).toHaveProperty("startDate");
    expect(range).toHaveProperty("endDate");
    expect(range.startDate).toBeInstanceOf(Date);
    expect(range.endDate).toBeInstanceOf(Date);
  });

  it("startDate debería ser las 00:00:00.000 de hoy", () => {
    const { startDate } = getTodayRange();
    expect(startDate.getHours()).toBe(0);
    expect(startDate.getMinutes()).toBe(0);
    expect(startDate.getSeconds()).toBe(0);
    expect(startDate.getMilliseconds()).toBe(0);
  });

  it("endDate debería ser las 23:59:59.999 de hoy", () => {
    const { endDate } = getTodayRange();
    expect(endDate.getHours()).toBe(23);
    expect(endDate.getMinutes()).toBe(59);
    expect(endDate.getSeconds()).toBe(59);
    expect(endDate.getMilliseconds()).toBe(999);
  });

  it("startDate debería ser antes que endDate", () => {
    const { startDate, endDate } = getTodayRange();
    expect(startDate.getTime()).toBeLessThan(endDate.getTime());
  });
});
