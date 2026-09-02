import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiClient, refreshClient } from './client';
import { TokenStorage } from '../auth/TokenStorage';
import { authEvents } from '../auth/authEvents';
import type { TokenResponse } from './types';

// Paths that must never trigger a refresh-and-retry (they're either the
// login/register calls themselves, made with no token yet, or the refresh
// call itself). Everything else -- including /auth/me -- gets the silent
// refresh treatment.
const NON_RETRYABLE_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

let refreshPromise: Promise<TokenResponse> | null = null;

function isNonRetryablePath(url: string | undefined): boolean {
  if (!url) return false;
  return NON_RETRYABLE_PATHS.some((path) => url.startsWith(path));
}

apiClient.interceptors.request.use((config) => {
  const token = TokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function refreshTokens(): Promise<TokenResponse> {
  const currentRefreshToken = TokenStorage.getRefreshToken();
  if (!currentRefreshToken) {
    throw new Error('No refresh token available');
  }
  const response = await refreshClient.post<TokenResponse>('/auth/refresh', {
    refreshToken: currentRefreshToken,
  });
  return response.data;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;
    const status = error.response?.status;

    if (status !== 401 || !config || isNonRetryablePath(config.url) || config._retried) {
      if (status === 401 && (!config || !isNonRetryablePath(config.url))) {
        TokenStorage.clear();
        authEvents.emitLogout();
      }
      return Promise.reject(error);
    }

    config._retried = true;

    try {
      refreshPromise ??= refreshTokens().finally(() => {
        refreshPromise = null;
      });
      const tokens = await refreshPromise;
      TokenStorage.save(tokens.accessToken, tokens.refreshToken);
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return apiClient(config);
    } catch (refreshError) {
      TokenStorage.clear();
      authEvents.emitLogout();
      return Promise.reject(refreshError);
    }
  },
);
