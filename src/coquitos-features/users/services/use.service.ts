import { CoquitoApi } from "@/config/axios.adapter"
import type { User } from "../interfaces"


export const getUsers = async () : Promise<User[]> => {
  try {
    const response = await CoquitoApi.get<User[]>('/users')
    return response.data
  } catch (error) {
    throw `Error al obtener usuarios: ${error}`
  }
}