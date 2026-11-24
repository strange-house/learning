import React, { createContext, useContext, useMemo } from 'react';
import { darkColors, lightColors } from './colors';
import type { ThemeColors } from './colors';
import { useSettingsStore } from '../stores/useSettingsStore';

interface ThemeValue {
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeValue>({ colors: lightColors, isDark: false });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useSettingsStore((s) => s.darkMode);
  const value = useMemo<ThemeValue>(
    () => ({ colors: darkMode ? darkColors : lightColors, isDark: darkMode }),
    [darkMode],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  return useContext(ThemeContext);
}
