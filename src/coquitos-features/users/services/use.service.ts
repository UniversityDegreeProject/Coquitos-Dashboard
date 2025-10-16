import { CoquitoApi } from "@/config/axios.adapter"
import { AxiosError } from "axios";
import type { User, UsersResponse } from "../interfaces/user.interface";




export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await CoquitoApi.get<UsersResponse>('/users/');
    
    return response.data.users;
  } catch (error) {
    throw new Error(`Error al obtener usuarios: ${error}`);
  }
}

export const searchUsers = async (search: string): Promise<User[]> => {
  try {
    const response = await CoquitoApi.get<UsersResponse>(`/users/search?search=${search}`);
    return response.data.users;
  } catch (error) {
    throw new Error(`Error al buscar usuarios: ${error}`);
  }
}


export const createUser = async (user: User): Promise<User> => {
  try {
  const response = await CoquitoApi.post('/auth/register', user);
    return response.data.user;
    
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error|| 'Error al crear usuario');
    }
    throw new Error('Error desconocido');
  }
}


export const updateUser = async (userId: string, user: User): Promise<User> => {
  try {
    const response = await CoquitoApi.patch(`/users/${userId}`, user);
    return response.data.user;
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error|| 'Error al actualizar usuario');
    }
    throw new Error('Error desconocido');
  }
}


export const deleteUser = async (userId: string): Promise<User> => {
  try {
    const response = await CoquitoApi.delete(`/users/${userId}`);
    return response.data.user;
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error|| 'Error al eliminar usuario');
    }
    throw new Error('Error desconocido');
  }
}

