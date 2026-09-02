import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './CircleIconButton.css';

interface CircleIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  'aria-label': string;
}

export function CircleIconButton({ icon, className, ...rest }: CircleIconButtonProps) {
  return (
    <button className={`circle-icon-button ${className ?? ''}`} {...rest}>
      {icon}
    </button>
  );
}
