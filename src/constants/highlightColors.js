export const HIGHLIGHT_COLORS = [
  { hex: '#FFD700', label: 'Gold' },
  { hex: '#00BFFF', label: 'Blue' },
  { hex: '#32CD32', label: 'Green' },
  { hex: '#FF8C00', label: 'Orange' },
];

// For quick lookup by hex code
export const COLOR_LABELS = Object.fromEntries(
  HIGHLIGHT_COLORS.map(({ hex, label }) => [hex, label])
);