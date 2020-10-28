export interface Login {
  password?: string
  username?: string
  phone_number?: string
  email?: string
}

export interface LoginRes {
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
}
