import { PillButton } from './PillButton';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="confirm-dialog-overlay" role="presentation" onClick={onCancel}>
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className="text-title">
          {title}
        </h2>
        <p className="text-body confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <PillButton variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </PillButton>
          <PillButton variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </PillButton>
        </div>
      </div>
    </div>
  );
}
