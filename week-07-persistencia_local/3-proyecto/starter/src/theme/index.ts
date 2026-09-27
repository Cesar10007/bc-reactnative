export const COLORS = {
  background: '#0d1117',
  surface: '#161b22',
  surfaceHigh: '#21262d',
  card: '#21262d',
  accent: '#61DAFB',
  accentPurple: '#a855f7',
  success: '#3fb950',
  warning: '#d29922',
  danger: '#f85149',
  error: '#f85149',
  text: '#e6edf3',
  textPrimary: '#e6edf3',
  textSecondary: '#8b949e',
  textMuted: '#8b949e',
  border: '#30363d',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const TYPOGRAPHY = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: COLORS.textPrimary },
  h2: { fontSize: 22, fontWeight: '600' as const, color: COLORS.textPrimary },
  h3: { fontSize: 18, fontWeight: '600' as const, color: COLORS.textPrimary },
  heading: { fontSize: 22, fontWeight: '700' as const, color: COLORS.textPrimary },
  title: { fontSize: 17, fontWeight: '600' as const, color: COLORS.textPrimary },
  body: { fontSize: 16, fontWeight: '400' as const, color: COLORS.textPrimary },
  caption: { fontSize: 13, fontWeight: '400' as const, color: COLORS.textSecondary },
  label: { fontSize: 12, fontWeight: '500' as const, color: COLORS.textMuted },
} as const;
