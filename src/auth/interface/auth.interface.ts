import type { Role, Status } from "@/coquitos-features/users/interfaces";


export interface AuthLoginFormData {
  username : string;
  password: string;
}


export interface AuthLoginResponse {
  user:         User;
  accessToken:  string;
  refreshToken: string;
}

export interface User {
  id:             string;
  username:       string;
  email:          string;
  emailVerified:  boolean;
  firstName:      string;
  lastName:       string;
  phone:          string;
  role:           Role;
  status:         Status;
  createdAt:      Date;
  updatedAt:      Date;
  lastConnection: Date;
}
