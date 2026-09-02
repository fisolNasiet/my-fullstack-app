import { Trash2 } from 'lucide-react';
import type { Note } from '../api/types';
import { resolveNoteColor } from '../utils/colorUtils';
import './NoteCard.css';

interface NoteCardProps {
  note: Note;
  onDelete: () => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const accent = resolveNoteColor(note.color);

  return (
    <article className="note-card" style={{ background: accent.hex }}>
      <div className="note-card__header">
        <h3 className="text-title-medium note-card__title">{note.title}</h3>
        <button
          type="button"
          className="note-card__delete"
          aria-label={`Delete note "${note.title}"`}
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <p className="text-body-medium note-card__content">{note.content}</p>
    </article>
  );
}
