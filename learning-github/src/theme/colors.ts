export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primarySoft: string;
  onPrimary: string;
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  overlay: string;
}

export const lightColors: ThemeColors = {
  primary: '#4C6FFF',
  primaryDark: '#3D55E0',
  primarySoft: '#EDF1FF',
  onPrimary: '#FFFFFF',
  bg: '#F5F6FA',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF0F6',
  border: '#E8EBF2',
  text: '#1B2430',
  textSecondary: '#5A6378',
  textMuted: '#8A93A6',
  success: '#16A34A',
  successSoft: '#E8F7EE',
  warning: '#F59E0B',
  warningSoft: '#FEF3E2',
  danger: '#E5484D',
  dangerSoft: '#FDEBEC',
  overlay: 'rgba(15, 20, 35, 0.45)',
};

export const darkColors: ThemeColors = {
  primary: '#7C8FFF',
  primaryDark: '#4C6FFF',
  primarySoft: '#1E2745',
  onPrimary: '#FFFFFF',
  bg: '#0E1015',
  surface: '#171A22',
  surfaceAlt: '#1F2330',
  border: '#2A2F3D',
  text: '#EDF0F8',
  textSecondary: '#A8AEBD',
  textMuted: '#6B7288',
  success: '#4ADE80',
  successSoft: '#122A1C',
  warning: '#FBBF24',
  warningSoft: '#2E2413',
  danger: '#F87171',
  dangerSoft: '#2E1616',
  overlay: 'rgba(0, 0, 0, 0.6)',
};
