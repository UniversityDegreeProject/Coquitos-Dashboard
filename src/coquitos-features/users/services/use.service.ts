import { CoquitoApi } from "@/config/axios.adapter"
import type { User } from "../interfaces"

interface UsersResponse {
  users: User[];
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await CoquitoApi.get<UsersResponse>('users/');
    
    // La API retorna { users: [...] }, necesitamos extraer el array
    return response.data.users;
  } catch (error) {
    throw new Error(`Error al obtener usuarios: ${error}`);
  }
}