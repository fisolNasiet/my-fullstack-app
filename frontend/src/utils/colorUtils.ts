export interface NoteAccentColor {
  name: string;
  value: number;
  hex: string;
}

// 32-bit ARGB integers (0xAARRGGBB) for the 4 accent colors.
export const NOTE_ACCENT_COLORS: NoteAccentColor[] = [
  { name: 'coral', value: 0xffff9e80, hex: '#FF9E80' },
  { name: 'yellow', value: 0xffffd54f, hex: '#FFD54F' },
  { name: 'green', value: 0xffb9e4a6, hex: '#B9E4A6' },
  { name: 'blue', value: 0xffa8d8f0, hex: '#A8D8F0' },
];

const DEFAULT_ACCENT = NOTE_ACCENT_COLORS[0];

// Resolves a note's stored color value to a known accent, falling back to a
// default for legacy/unrecognized values already present in the database.
export function resolveNoteColor(value: number): NoteAccentColor {
  return NOTE_ACCENT_COLORS.find((accent) => accent.value === value) ?? DEFAULT_ACCENT;
}
