export interface Note {
  id?: number;
  title: string;
  content: string;
  color: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiErrorResponse {
  errors?: string[];
}
