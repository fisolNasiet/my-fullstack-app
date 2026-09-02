import './FilterPill.css';

interface FilterPillProps {
  label: string;
  count: number;
}

// Decorative only, matching the Android app: shows a label + count but
// is not wired to any actual filtering logic.
export function FilterPill({ label, count }: FilterPillProps) {
  return (
    <div className="filter-pill pill text-label">
      <span>{label}</span>
      <span className="filter-pill__count">{count}</span>
    </div>
  );
}
