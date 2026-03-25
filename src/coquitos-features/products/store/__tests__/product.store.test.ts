import { describe, it, expect, beforeEach } from "vitest";
import { useProductStore } from "../product.store";
import type { Product } from "../../interfaces";

/**
 * Helper: producto mock para tests
 */
const mockProduct: Product = {
  id: "prod-123",
  name: "Chorizo Clásico",
  description: "Chorizo artesanal",
  price: 18.5,
  sku: "CHO-CLA-001",
  stock: 10,
  minStock: 5,
  image: "data:image/png;base64,test",
  ingredients: "Cerdo, sal, especias",
  categoryId: "cat-123",
  status: "Disponible",
  isVariableWeight: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("useProductStore", () => {
  // Reset store antes de cada test
  beforeEach(() => {
    useProductStore.setState({
      modalMode: null,
      productToUpdate: null,
      viewMode: "grid",
    });
  });

  // ============================================================
  // Estado inicial
  // ============================================================
  it("debería tener estado inicial correcto", () => {
    const state = useProductStore.getState();
    expect(state.modalMode).toBeNull();
    expect(state.productToUpdate).toBeNull();
    expect(state.viewMode).toBe("grid");
  });

  // ============================================================
  // Abrir modal de creación
  // ============================================================
  it("debería abrir modal en modo create", () => {
    useProductStore.getState().setOpenModalCreate();
    const state = useProductStore.getState();
    expect(state.modalMode).toBe("create");
    expect(state.productToUpdate).toBeNull();
  });

  // ============================================================
  // Abrir modal de edición
  // ============================================================
  it("debería abrir modal en modo update con producto", () => {
    useProductStore.getState().setOpenModalUpdate(mockProduct);
    const state = useProductStore.getState();
    expect(state.modalMode).toBe("update");
    expect(state.productToUpdate).toEqual(mockProduct);
    expect(state.productToUpdate?.name).toBe("Chorizo Clásico");
  });

  // ============================================================
  // Cerrar modal
  // ============================================================
  it("debería cerrar modal y limpiar producto", () => {
    // Primero abrir
    useProductStore.getState().setOpenModalUpdate(mockProduct);
    expect(useProductStore.getState().modalMode).toBe("update");

    // Luego cerrar
    useProductStore.getState().closeModal();
    const state = useProductStore.getState();
    expect(state.modalMode).toBeNull();
    expect(state.productToUpdate).toBeNull();
  });

  // ============================================================
  // Cambiar modo de vista
  // ============================================================
  it("debería cambiar viewMode a list", () => {
    useProductStore.getState().setViewMode("list");
    expect(useProductStore.getState().viewMode).toBe("list");
  });

  it("debería cambiar viewMode a grid", () => {
    useProductStore.getState().setViewMode("list");
    useProductStore.getState().setViewMode("grid");
    expect(useProductStore.getState().viewMode).toBe("grid");
  });

  // ============================================================
  // Flujo completo: crear → cerrar → editar → cerrar
  // ============================================================
  it("debería manejar flujo completo de modales", () => {
    // 1. Abrir crear
    useProductStore.getState().setOpenModalCreate();
    expect(useProductStore.getState().modalMode).toBe("create");

    // 2. Cerrar
    useProductStore.getState().closeModal();
    expect(useProductStore.getState().modalMode).toBeNull();

    // 3. Abrir editar
    useProductStore.getState().setOpenModalUpdate(mockProduct);
    expect(useProductStore.getState().modalMode).toBe("update");
    expect(useProductStore.getState().productToUpdate?.id).toBe("prod-123");

    // 4. Cerrar
    useProductStore.getState().closeModal();
    expect(useProductStore.getState().modalMode).toBeNull();
    expect(useProductStore.getState().productToUpdate).toBeNull();
  });
});
