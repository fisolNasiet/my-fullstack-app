import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL as string;

export const apiClient = axios.create({ baseURL });

// Separate instance for /auth/refresh so it never recurses through the
// interceptors below (which would try to attach a stale Authorization header).
export const refreshClient = axios.create({ baseURL });
