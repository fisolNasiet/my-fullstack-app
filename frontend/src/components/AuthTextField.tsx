import type { InputHTMLAttributes } from 'react';
import './AuthTextField.css';

interface AuthTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AuthTextField({ label, error, id, className, ...rest }: AuthTextFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`auth-text-field ${className ?? ''}`}>
      <label htmlFor={fieldId} className="text-label auth-text-field__label">
        {label}
      </label>
      <input
        id={fieldId}
        className={`auth-text-field__input text-body ${error ? 'auth-text-field__input--error' : ''}`}
        {...rest}
      />
      {error && <p className="auth-text-field__error text-body-medium">{error}</p>}
    </div>
  );
}
