import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import * as notesApi from '../api/notesApi';
import { extractErrorMessage } from '../api/errors';
import { NOTE_ACCENT_COLORS } from '../utils/colorUtils';
import { CircleIconButton } from '../components/CircleIconButton';
import { PillButton } from '../components/PillButton';
import './CreateNotePage.css';

export function CreateNotePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(NOTE_ACCENT_COLORS[0].value);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      setError('Give your note a title.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await notesApi.createNote({ title: title.trim(), content, color });
      navigate('/notes', { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="create-note-page">
      <header className="create-note-page__header">
        <CircleIconButton
          icon={<ArrowLeft size={20} />}
          aria-label="Back"
          onClick={() => navigate(-1)}
        />
      </header>

      <form className="create-note-page__form" onSubmit={handleSubmit}>
        {error && <p className="text-body-medium create-note-page__error">{error}</p>}

        <input
          className="create-note-page__title text-display"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        <textarea
          className="create-note-page__content text-body"
          placeholder="Start writing…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
        />

        <div className="create-note-page__colors">
          {NOTE_ACCENT_COLORS.map((accent) => (
            <button
              type="button"
              key={accent.name}
              aria-label={`Use ${accent.name} accent`}
              aria-pressed={color === accent.value}
              className={`create-note-page__swatch ${color === accent.value ? 'create-note-page__swatch--selected' : ''}`}
              style={{ background: accent.hex }}
              onClick={() => setColor(accent.value)}
            />
          ))}
        </div>

        <PillButton type="submit" loading={saving} className="create-note-page__save">
          Save note
        </PillButton>
      </form>
    </div>
  );
}
