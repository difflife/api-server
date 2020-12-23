export interface Login {
  password: string
  username?: string
  phone_number?: string
  email?: string
  country_code?: string
}

export interface LoginRes {
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
}
