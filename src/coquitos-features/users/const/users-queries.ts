import type { SearchUsersParams } from "../interfaces";

export const usersQueries = {
  allUsers: ["users"] as const,
  userById: (id: string) => [...usersQueries.allUsers, id] as const,
  userByEmail: (email: string) => [...usersQueries.allUsers, email] as const,
  userWithFilters: (params: SearchUsersParams) =>
    [...usersQueries.allUsers, "filters", params] as const,
};
