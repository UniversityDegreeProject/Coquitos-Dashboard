import { CoquitoApi } from "@/config/axios.adapter"
import type { User } from "../interfaces"
import { AxiosError } from "axios";

interface UsersResponse {
  users: User[];
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await CoquitoApi.get<UsersResponse>('/users/');
    
    return response.data.users;
  } catch (error) {
    throw new Error(`Error al obtener usuarios: ${error}`);
  }
}


export const createUser = async (user: User): Promise<User> => {
  try {
  const response = await CoquitoApi.post('/auth/register', user);
    return response.data;
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error|| 'Error al crear usuario');
    }
    throw new Error('Error desconocido');
  }
}

