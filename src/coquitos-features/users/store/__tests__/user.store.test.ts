import { describe, it, expect, beforeEach } from "vitest";
import { useUserStore } from "../user.store";
import { createUserSchema } from "../../schemas/user.schema";
import type { User } from "../../interfaces";

// ============================================================
// Mock de usuario para tests
// ============================================================
const mockUser: User = {
  id: "user-123",
  username: "jesus.zeballos",
  email: "jesus@coquito.com",
  emailVerified: true,
  firstName: "Jesus",
  lastName: "Zeballos",
  phone: "61853613",
  role: "Administrador",
  status: "Activo",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ============================================================
// Store: Estado de usuarios
// ============================================================
describe("useUserStore", () => {
  beforeEach(() => {
    useUserStore.setState({
      modalMode: null,
      userToUpdate: null,
      isMutating: false,
      pendingEmailVerifications: new Set<string>(),
    });
  });

  it("debería tener estado inicial correcto", () => {
    const state = useUserStore.getState();
    expect(state.modalMode).toBeNull();
    expect(state.userToUpdate).toBeNull();
    expect(state.isMutating).toBe(false);
    expect(state.pendingEmailVerifications.size).toBe(0);
  });

  it("debería abrir modal en modo create", () => {
    useUserStore.getState().setOpenModalCreate();
    expect(useUserStore.getState().modalMode).toBe("create");
  });

  it("debería abrir modal en modo update con usuario", () => {
    useUserStore.getState().setOpenModalUpdate(mockUser);
    const state = useUserStore.getState();
    expect(state.modalMode).toBe("update");
    expect(state.userToUpdate?.username).toBe("jesus.zeballos");
  });

  it("debería cerrar modal y limpiar usuario", () => {
    useUserStore.getState().setOpenModalUpdate(mockUser);
    useUserStore.getState().closeModal();
    const state = useUserStore.getState();
    expect(state.modalMode).toBeNull();
    expect(state.userToUpdate).toBeNull();
  });

  it("debería activar/desactivar isMutating", () => {
    useUserStore.getState().setIsMutating(true);
    expect(useUserStore.getState().isMutating).toBe(true);

    useUserStore.getState().setIsMutating(false);
    expect(useUserStore.getState().isMutating).toBe(false);
  });

  it("debería agregar verificación de email pendiente", () => {
    useUserStore.getState().addPendingEmailVerification("user-123");
    expect(
      useUserStore.getState().pendingEmailVerifications.has("user-123"),
    ).toBe(true);
    expect(useUserStore.getState().pendingEmailVerifications.size).toBe(1);
  });

  it("debería eliminar verificación de email pendiente", () => {
    useUserStore.getState().addPendingEmailVerification("user-123");
    useUserStore.getState().removePendingEmailVerification("user-123");
    expect(
      useUserStore.getState().pendingEmailVerifications.has("user-123"),
    ).toBe(false);
    expect(useUserStore.getState().pendingEmailVerifications.size).toBe(0);
  });

  it("debería manejar múltiples verificaciones de email", () => {
    useUserStore.getState().addPendingEmailVerification("user-1");
    useUserStore.getState().addPendingEmailVerification("user-2");
    useUserStore.getState().addPendingEmailVerification("user-3");
    expect(useUserStore.getState().pendingEmailVerifications.size).toBe(3);

    useUserStore.getState().removePendingEmailVerification("user-2");
    expect(useUserStore.getState().pendingEmailVerifications.size).toBe(2);
    expect(
      useUserStore.getState().pendingEmailVerifications.has("user-2"),
    ).toBe(false);
  });

  it("debería manejar flujo completo: crear usuario → mutating → cerrar", () => {
    // 1. Abrir modal crear
    useUserStore.getState().setOpenModalCreate();
    expect(useUserStore.getState().modalMode).toBe("create");

    // 2. Activar mutación (formulario enviado)
    useUserStore.getState().setIsMutating(true);
    expect(useUserStore.getState().isMutating).toBe(true);

    // 3. Cerrar modal (creación exitosa)
    useUserStore.getState().closeModal();
    useUserStore.getState().setIsMutating(false);
    expect(useUserStore.getState().modalMode).toBeNull();
    expect(useUserStore.getState().isMutating).toBe(false);
  });
});

// ============================================================
// Schema: Validación de usuario
// ============================================================
describe("createUserSchema", () => {
  const validUser = {
    username: "vendedor01",
    email: "vendedor@coquito.com",
    emailVerified: true,
    password: "Pass@123",
    firstName: "Pedro",
    lastName: "Garcia",
    phone: "61853613",
    role: "Vendedor" as const,
    status: "Activo" as const,
  };

  it("debería aceptar un usuario válido", () => {
    const result = createUserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it("debería aceptar usuario sin password (edición)", () => {
    // @eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = validUser;
    console.log(password);
    const result = createUserSchema.safeParse(userWithoutPassword);
    expect(result.success).toBe(true);
  });

  // Username
  it("debería rechazar username con menos de 3 caracteres", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      username: "ab",
    });
    expect(result.success).toBe(false);
  });

  // Email
  it("debería rechazar email inválido", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      email: "no-es-email",
    });
    expect(result.success).toBe(false);
  });

  // Password
  it("debería rechazar password sin mayúscula", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      password: "pass@123",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar password sin carácter especial", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      password: "Pass1234",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar password con menos de 6 caracteres", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      password: "Pa@1",
    });
    expect(result.success).toBe(false);
  });

  // Nombre
  it("debería rechazar firstName que no comience con mayúscula", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      firstName: "pedro",
    });
    expect(result.success).toBe(false);
  });

  // Teléfono
  it("debería aceptar teléfono local de 8 dígitos", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      phone: "61853613",
    });
    expect(result.success).toBe(true);
  });

  it("debería aceptar teléfono internacional con prefijo", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      phone: "+59161853613",
    });
    expect(result.success).toBe(true);
  });

  it("debería rechazar teléfono con formato incorrecto", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      phone: "123",
    });
    expect(result.success).toBe(false);
  });

  // Role
  it("debería aceptar rol Administrador", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      role: "Administrador",
    });
    expect(result.success).toBe(true);
  });

  it("debería rechazar rol inválido", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      role: "SuperAdmin",
    });
    expect(result.success).toBe(false);
  });

  // Status
  it("debería aceptar los 3 estados válidos", () => {
    for (const status of ["Activo", "Inactivo", "Suspendido"]) {
      const result = createUserSchema.safeParse({ ...validUser, status });
      expect(result.success).toBe(true);
    }
  });
});
