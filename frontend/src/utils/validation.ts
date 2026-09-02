const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// At least 9 characters, one uppercase, one lowercase, one digit.
const PASSWORD_POLICY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{9,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return PASSWORD_POLICY_REGEX.test(password);
}

export const PASSWORD_POLICY_HINT =
  'Password must be at least 9 characters and include an uppercase letter, a lowercase letter, and a digit.';
