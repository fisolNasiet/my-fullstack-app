import { apiClient } from './client';
import type { AuthCredentials, TokenResponse } from './types';

export async function login(email: string, password: string): Promise<TokenResponse> {
  const credentials: AuthCredentials = { email, password };
  const response = await apiClient.post<TokenResponse>('/auth/login', credentials);
  return response.data;
}

export async function register(email: string, password: string): Promise<void> {
  const credentials: AuthCredentials = { email, password };
  await apiClient.post('/auth/register', credentials);
}

export async function deleteAccount(): Promise<void> {
  await apiClient.delete('/auth/me');
}
