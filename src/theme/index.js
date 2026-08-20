export const colors = {
  // Backgrounds
  bg: '#F7F9FE',
  card: '#FFFFFF',
  cardAlt: '#F0F4FF',

  // Brand
  navy: '#0B1C3D',
  navyMid: '#1A3461',
  blue: '#1E56C8',
  blueLight: '#4B7BF5',
  bluePale: '#E8EFFF',

  // Reward accent
  gold: '#F5A623',
  goldLight: '#FFF3D0',
  goldDark: '#C97D0E',

  // Stage palette
  stage1: '#3B82F6',
  stage2: '#8B5CF6',
  stage3: '#F59E0B',
  stage4: '#EF4444',
  stage5: '#10B981',

  // Semantic
  success: '#10B981',
  successLight: '#D1FAE5',
  successDark: '#065F46',

  // Roadmap future concepts
  roadmapBg: '#F5F4FF',
  roadmapBorder: '#C4C2F0',
  roadmapAccent: '#6B5CE7',
  roadmapLabel: '#5B4FCF',

  // Text
  text: '#0B1C3D',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Borders & dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Tab bar
  tabActive: '#1E56C8',
  tabInactive: '#94A3B8',
  tabBg: '#FFFFFF',
};

export const gradients = {
  hero: ['#0B1C3D', '#1A3461', '#1E56C8'],
  heroShort: ['#0B1C3D', '#1E56C8'],
  stage1: ['#3B82F6', '#2563EB'],
  stage2: ['#8B5CF6', '#7C3AED'],
  stage3: ['#F59E0B', '#D97706'],
  stage4: ['#EF4444', '#DC2626'],
  stage5: ['#10B981', '#059669'],
  gold: ['#F5A623', '#E8930C'],
  celebration: ['#1E56C8', '#6B5CE7'],
};

export const stageGradients = [
  gradients.stage1,
  gradients.stage2,
  gradients.stage3,
  gradients.stage4,
  gradients.stage5,
];

export const typography = {
  hero: { fontSize: 34, fontWeight: '800', lineHeight: 42, letterSpacing: -0.5 },
  h1: { fontSize: 28, fontWeight: '700', lineHeight: 36, letterSpacing: -0.3 },
  h2: { fontSize: 22, fontWeight: '700', lineHeight: 30, letterSpacing: -0.2 },
  h3: { fontSize: 18, fontWeight: '600', lineHeight: 26 },
  h4: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyMed: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
  small: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  smallMed: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  smallBold: { fontSize: 14, fontWeight: '700', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  captionMed: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
  label: { fontSize: 11, fontWeight: '700', lineHeight: 16, letterSpacing: 0.8, textTransform: 'uppercase' },
  micro: { fontSize: 10, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#0B1C3D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#0B1C3D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: '#0B1C3D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
  },
  colored: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  }),
};
