import { CoquitoApi } from "@/config/axios.adapter"
import { AxiosError } from "axios";
import type { User, GetUsersResponse, CreateUserResponse, UpdateUserResponse, DeleteUserResponse, SearchUsersParams } from "../interfaces";
import { backendUserToFrontendUser } from "../mapper/backendUserToFrontendUser";



export const getUsers = async ( params : SearchUsersParams): Promise<GetUsersResponse> => {
  try {
    // Limpiar parámetros vacíos antes de enviar al backend
    const cleanParams: Partial<SearchUsersParams> = {
      page: params.page,
      limit: params.limit,
    };

    // Solo agregar parámetros opcionales si tienen valor
    if (params.search && params.search.trim() !== "") {
      cleanParams.search = params.search;
    }
    if (params.role && String(params.role).trim() !== "") {
      cleanParams.role = params.role;
    }
    if (params.status && String(params.status).trim() !== "") {
      cleanParams.status = params.status;
    }

    const response = await CoquitoApi.get<GetUsersResponse>('/users', { params: cleanParams });
    const { data } = response;
    const { data: users, ...allData } = data;
    return {
      ...allData,
      data : users.map( backendUserToFrontendUser ),
    }
  } catch (error) {
    throw new Error(`Error al obtener usuarios: ${error}`);
  }
}

export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await CoquitoApi.get<User>(`/users/${userId}`);
    const { data : user } = response;
    return backendUserToFrontendUser( user);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error || 'Error al obtener usuario');
    }
    throw new Error('Error desconocido');
  }
}



export const createUser = async (user: User): Promise<CreateUserResponse> => {
  try {
  const response = await CoquitoApi.post<CreateUserResponse>('/auth/register', user);
    const { data } = response;
    return {
      message : data.message,
      user : backendUserToFrontendUser( data.user ),
    }
    
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error|| 'Error al crear usuario');
    }
    throw new Error('Error desconocido');
  }
}


export const updateUser = async (userId: string, user: User): Promise<UpdateUserResponse> => {
  try {
    const response = await CoquitoApi.patch<UpdateUserResponse>(`/users/${userId}`, user);
    const { data } = response;
    return {
      message : data.message,
      user : backendUserToFrontendUser( data.user ),
    }
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error|| 'Error al actualizar usuario');
    }
    throw new Error('Error desconocido');
  }
}


export const deleteUser = async (userId: string): Promise<DeleteUserResponse> => {
  try {
    const response = await CoquitoApi.delete<DeleteUserResponse>(`/users/${userId}`);
    const { data } = response;
    return {
      message : data.message,
      user : backendUserToFrontendUser( data.user ),
    }
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error|| 'Error al eliminar usuario');
    }
    throw new Error('Error desconocido');
  }
}
export const sendVerificationEmail = async (email: string): Promise<User> => {
  try {
    const response = await CoquitoApi.post(`/auth/retry-verify-email`, { email });
    return response.data.user;
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error|| 'Error al enviar email de verificación');
    }
    throw new Error('Error desconocido');
  }
}


export const changeUserPassword = async ( email : string): Promise<void> => {
  try {
    const response = await CoquitoApi.post(`/auth/forgot-password`, { email });
    return response.data.message
  } catch (error : unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error|| 'Error al cambiar la contraseña');
    }
    throw new Error('Error desconocido');
  }
}
