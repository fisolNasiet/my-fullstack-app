import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { extractErrorMessage } from '../api/errors';
import { CircleIconButton } from '../components/CircleIconButton';
import { PillButton } from '../components/PillButton';
import { ConfirmDialog } from '../components/ConfirmDialog';
import './AccountPage.css';

export function AccountPage() {
  const { deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await deleteAccount();
      navigate('/login', { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err));
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <div className="account-page">
      <header className="account-page__header">
        <CircleIconButton
          icon={<ArrowLeft size={20} />}
          aria-label="Back"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-title">Account</h1>
      </header>

      {error && <p className="text-body-medium account-page__error">{error}</p>}

      <div className="account-page__section">
        <h2 className="text-title-medium">Delete account</h2>
        <p className="text-body-medium account-page__hint">
          This permanently deletes your account and all of your notes. This can't be undone.
        </p>
        <PillButton variant="danger" onClick={() => setConfirming(true)}>
          Delete account
        </PillButton>
      </div>

      {confirming && (
        <ConfirmDialog
          title="Delete account?"
          message="Your account and all notes will be permanently deleted."
          confirmLabel="Delete account"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}
