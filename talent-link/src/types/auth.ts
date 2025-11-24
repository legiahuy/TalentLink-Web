export interface LoginResponse {
  access_token: string
  refresh_token: string
}

export interface RefreshResponse {
  access_token: string
  refresh_token: string
}

export interface SignUpParams {
  display_name: string
  username: string
  email: string
  password: string
  role: string
}

export interface PasswordResetConfirmResponse {
  reset_token: string
}
