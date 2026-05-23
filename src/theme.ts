import { useColorScheme } from 'react-native';

export const Colors = {
  light: {
    bg:              '#f8f9fb',
    surface:         '#ffffff',
    surfaceAlt:      '#f3f4f6',
    border:          '#f1f3f6',
    borderStrong:    '#e5e7eb',
    text:            '#111827',
    textSecondary:   '#6b7280',
    textTertiary:    '#9ca3af',
    primary:         '#6366f1',
    tabBar:          '#ffffff',
    tabBarBorder:    '#f1f3f6',
    inputBg:         '#f3f4f6',
    searchBg:        '#f3f4f6',
    cardShadow:      '#000000',
  },
  dark: {
    bg:              '#0f172a',
    surface:         '#1e293b',
    surfaceAlt:      '#334155',
    border:          '#1e293b',
    borderStrong:    '#334155',
    text:            '#f1f5f9',
    textSecondary:   '#94a3b8',
    textTertiary:    '#64748b',
    primary:         '#818cf8',
    tabBar:          '#1e293b',
    tabBarBorder:    '#334155',
    inputBg:         '#334155',
    searchBg:        '#334155',
    cardShadow:      '#000000',
  },
};

export type Theme = typeof Colors.light;

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? Colors.dark : Colors.light;
}
