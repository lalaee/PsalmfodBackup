// Border colors for each highlight, by label
export const HIGHLIGHT_BORDER_COLORS = {
  Red: '#521800',
  Blue: '#02356C',
  Green: '#00523C',
  Orange: '#524300',
};
export const HIGHLIGHT_COLORS = [
  { hex: '#251413', label: 'Red' },
  { hex: '#10212D', label: 'Blue' },
  { hex: '#132522', label: 'Green' },
  { hex: '#251F13', label: 'Orange' },
];

// For quick lookup by hex code
export const COLOR_LABELS = Object.fromEntries(
  HIGHLIGHT_COLORS.map(({ hex, label }) => [hex, label])
);