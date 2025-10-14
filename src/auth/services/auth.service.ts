import { CoquitoApi } from "@/config";
import type { UserResponse } from "@/coquitos-features/users/interfaces/user.interface";
import type { UserLoginFormData } from "../interface";

export const login = async ({ username, password }: UserLoginFormData): Promise<UserResponse> => {

    const response = await CoquitoApi.post(`/auth/login`, { username, password });
    
    if (!response.data) {
      throw new Error("Respuesta del servidor inválida");
    }
    
    return response.data;
  
};

