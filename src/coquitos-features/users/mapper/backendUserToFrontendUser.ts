import type { User } from "../interfaces"



export const backendUserToFrontendUser = (user: User): User => {
  return {
    ...user,
    id: user.id,
    username: user.username,
    email: user.email,
    emailVerified: user.emailVerified,
    firstName: user.firstName,
    lastName: user.lastName,
  }
}