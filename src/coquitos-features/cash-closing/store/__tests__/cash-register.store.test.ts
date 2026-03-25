import { describe, it, expect, beforeEach } from "vitest";
import { useCashRegisterStore } from "../cash-register.store";
import { openCashRegisterSchema } from "../../schemas/open-cash-register.schema";
import { closeCashRegisterSchema } from "../../schemas/close-cash-register.schema";

// ============================================================
// Store: Estado del cierre de caja
// ============================================================
describe("useCashRegisterStore", () => {
  beforeEach(() => {
    useCashRegisterStore.setState({
      isOpenCashModalOpen: false,
      isCloseCashModalOpen: false,
    });
  });

  it("debería tener estado inicial con modales cerrados", () => {
    const state = useCashRegisterStore.getState();
    expect(state.isOpenCashModalOpen).toBe(false);
    expect(state.isCloseCashModalOpen).toBe(false);
  });

  it("debería abrir modal de apertura de caja", () => {
    useCashRegisterStore.getState().openOpenCashModal();
    expect(useCashRegisterStore.getState().isOpenCashModalOpen).toBe(true);
    expect(useCashRegisterStore.getState().isCloseCashModalOpen).toBe(false);
  });

  it("debería cerrar modal de apertura de caja", () => {
    useCashRegisterStore.getState().openOpenCashModal();
    useCashRegisterStore.getState().closeOpenCashModal();
    expect(useCashRegisterStore.getState().isOpenCashModalOpen).toBe(false);
  });

  it("debería abrir modal de cierre de caja", () => {
    useCashRegisterStore.getState().openCloseCashModal();
    expect(useCashRegisterStore.getState().isCloseCashModalOpen).toBe(true);
    expect(useCashRegisterStore.getState().isOpenCashModalOpen).toBe(false);
  });

  it("debería cerrar modal de cierre de caja", () => {
    useCashRegisterStore.getState().openCloseCashModal();
    useCashRegisterStore.getState().closeCloseCashModal();
    expect(useCashRegisterStore.getState().isCloseCashModalOpen).toBe(false);
  });

  it("debería manejar flujo: abrir caja → cerrar modal → cerrar caja", () => {
    // 1. Abrir modal de apertura
    useCashRegisterStore.getState().openOpenCashModal();
    expect(useCashRegisterStore.getState().isOpenCashModalOpen).toBe(true);

    // 2. Cerrar modal de apertura (caja abierta)
    useCashRegisterStore.getState().closeOpenCashModal();
    expect(useCashRegisterStore.getState().isOpenCashModalOpen).toBe(false);

    // 3. Abrir modal de cierre
    useCashRegisterStore.getState().openCloseCashModal();
    expect(useCashRegisterStore.getState().isCloseCashModalOpen).toBe(true);

    // 4. Cerrar modal de cierre (caja cerrada)
    useCashRegisterStore.getState().closeCloseCashModal();
    expect(useCashRegisterStore.getState().isCloseCashModalOpen).toBe(false);
  });
});

// ============================================================
// Schema: Apertura de caja
// ============================================================
describe("openCashRegisterSchema", () => {
  it("debería aceptar datos válidos de apertura", () => {
    const result = openCashRegisterSchema.safeParse({
      userId: "550e8400-e29b-41d4-a716-446655440000",
      openingAmount: "500",
    });
    expect(result.success).toBe(true);
  });

  it("debería rechazar userId inválido", () => {
    const result = openCashRegisterSchema.safeParse({
      userId: "no-es-uuid",
      openingAmount: "500",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar monto vacío", () => {
    const result = openCashRegisterSchema.safeParse({
      userId: "550e8400-e29b-41d4-a716-446655440000",
      openingAmount: "",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar monto negativo", () => {
    const result = openCashRegisterSchema.safeParse({
      userId: "550e8400-e29b-41d4-a716-446655440000",
      openingAmount: "-100",
    });
    expect(result.success).toBe(false);
  });

  it("debería aceptar monto cero (empezar sin efectivo)", () => {
    const result = openCashRegisterSchema.safeParse({
      userId: "550e8400-e29b-41d4-a716-446655440000",
      openingAmount: "0",
    });
    expect(result.success).toBe(true);
  });
});

// ============================================================
// Schema: Cierre de caja
// ============================================================
describe("closeCashRegisterSchema", () => {
  const validClose = {
    cashRegisterId: "550e8400-e29b-41d4-a716-446655440000",
    closingAmount: "1500",
  };

  it("debería aceptar datos válidos de cierre", () => {
    const result = closeCashRegisterSchema.safeParse(validClose);
    expect(result.success).toBe(true);
  });

  it("debería aceptar cierre con notas opcionales", () => {
    const result = closeCashRegisterSchema.safeParse({
      ...validClose,
      notes: "Cierre normal, todo cuadra",
    });
    expect(result.success).toBe(true);
  });

  it("debería rechazar cashRegisterId inválido", () => {
    const result = closeCashRegisterSchema.safeParse({
      ...validClose,
      cashRegisterId: "no-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar monto vacío", () => {
    const result = closeCashRegisterSchema.safeParse({
      ...validClose,
      closingAmount: "",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar monto negativo", () => {
    const result = closeCashRegisterSchema.safeParse({
      ...validClose,
      closingAmount: "-500",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar notas con más de 500 caracteres", () => {
    const result = closeCashRegisterSchema.safeParse({
      ...validClose,
      notes: "A".repeat(501),
    });
    expect(result.success).toBe(false);
  });
});
