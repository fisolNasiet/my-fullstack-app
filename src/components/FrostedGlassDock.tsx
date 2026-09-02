import { Plus } from 'lucide-react';
import './FrostedGlassDock.css';

interface FrostedGlassDockProps {
  onAdd: () => void;
}

export function FrostedGlassDock({ onAdd }: FrostedGlassDockProps) {
  return (
    <div className="frosted-glass-dock frosted-glass pill">
      <button
        type="button"
        className="frosted-glass-dock__fab"
        aria-label="Create note"
        onClick={onAdd}
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
