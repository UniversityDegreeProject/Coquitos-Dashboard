import type { User } from "@/auth/interface";

export const getIdByUserRole = (user: User): string | undefined => {
  if (user.role === "Administrador") return undefined;

  return user.id;
};
