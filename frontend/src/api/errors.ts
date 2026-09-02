import axios from 'axios';
import type { ApiErrorResponse } from './types';

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const errors = error.response?.data?.errors;
    if (errors && errors.length > 0) {
      return errors.join(', ');
    }
    if (error.response?.status) {
      return `Request failed (${error.response.status})`;
    }
    if (error.message) {
      return error.message;
    }
  }
  return 'Something went wrong. Please try again.';
}
