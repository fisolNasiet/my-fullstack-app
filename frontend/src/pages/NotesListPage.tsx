import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
import * as notesApi from '../api/notesApi';
import type { Note } from '../api/types';
import { extractErrorMessage } from '../api/errors';
import { CircleIconButton } from '../components/CircleIconButton';
import { FilterPill } from '../components/FilterPill';
import { NoteCard } from '../components/NoteCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FrostedGlassDock } from '../components/FrostedGlassDock';
import './NotesListPage.css';

export function NotesListPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    notesApi
      .getNotes()
      .then((data) => {
        if (!cancelled) setNotes(data);
      })
      .catch((err) => {
        if (!cancelled) setError(extractErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function confirmDelete() {
    if (pendingDeleteId == null) return;
    setDeleting(true);
    try {
      await notesApi.deleteNote(pendingDeleteId);
      setNotes((prev) => prev.filter((note) => note.id !== pendingDeleteId));
      setPendingDeleteId(null);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="notes-page dotted-bg">
      <header className="notes-page__header">
        <h1 className="text-display">My Notes</h1>
        <CircleIconButton
          icon={<LayoutGrid size={20} />}
          aria-label="Account"
          onClick={() => navigate('/account')}
        />
      </header>

      <FilterPill label="All" count={notes.length} />

      {error && <p className="text-body-medium notes-page__error">{error}</p>}

      {loading ? (
        <p className="text-body notes-page__status">Loading notes…</p>
      ) : notes.length === 0 ? (
        <p className="text-body notes-page__status">No notes yet. Tap + to create one.</p>
      ) : (
        <div className="notes-page__grid">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={() => setPendingDeleteId(note.id ?? null)}
            />
          ))}
        </div>
      )}

      <FrostedGlassDock onAdd={() => navigate('/notes/new')} />

      {pendingDeleteId != null && (
        <ConfirmDialog
          title="Delete note?"
          message="This note will be permanently deleted."
          confirmLabel="Delete"
          loading={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
}
