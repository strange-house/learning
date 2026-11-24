import { create } from 'zustand';
import { getSettings, setSetting } from '../data/repositories/settingsRepository';

interface SettingsState {
  darkMode: boolean;
  loaded: boolean;
  hydrate: () => Promise<void>;
  setDarkMode: (v: boolean) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  darkMode: false,
  loaded: false,
  async hydrate() {
    const s = await getSettings();
    set({ darkMode: s.darkMode === '1', loaded: true });
  },
  async setDarkMode(v) {
    await setSetting('darkMode', v ? '1' : '0');
    set({ darkMode: v });
  },
}));
