import type { ButtonHTMLAttributes } from 'react';
import './PillButton.css';

type Variant = 'primary' | 'danger' | 'outline';

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

export function PillButton({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className,
  ...rest
}: PillButtonProps) {
  return (
    <button
      className={`pill-button pill-button--${variant} text-label ${className ?? ''}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className="pill-button__spinner" aria-hidden="true" /> : children}
    </button>
  );
}
