import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export type ScheduleItem = {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
};

export type Settings = {
  // Tournament Info
  tournamentName: string;
  logoPath: string;
  headerVisible: boolean;
  headerHeight: number;

  // Current Game State
  currentGame: number; // 1, 2, or 3

  // Schedule
  scheduleVisible: boolean;
  scheduleItems: ScheduleItem[];
  scheduleHeight: number;

  // Setters
  setTournamentName(v: string): void;
  setLogoPath(v: string): void;
  setHeaderVisible(v: boolean): void;
  setHeaderHeight(v: number): void;
  setCurrentGame(v: number): void;
  setScheduleVisible(v: boolean): void;
  setScheduleItems(v: ScheduleItem[]): void;
  setScheduleHeight(v: number): void;
};

const SettingsContext = createContext<Settings | null>(null);

// Load all settings from localStorage
const loadAllSettings = () => {
  try {
    const stored = localStorage.getItem('countdownDisplaySettings');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
  }
  return {};
};

// Default settings
const DEFAULT_SETTINGS = {
  tournamentName: 'WAIDLER TOURNAMENT',
  logoPath: '',
  headerVisible: true,
  headerHeight: 100,
  currentGame: 1,
  scheduleVisible: true,
  scheduleHeight: 100,
  scheduleItems: [
    { id: 'item-1', label: 'Spiel 1', startTime: '09:30', endTime: '12:30' },
    { id: 'item-2', label: 'Mittagspause', startTime: '12:30', endTime: '13:30' },
    { id: 'item-3', label: 'Spiel 2', startTime: '13:30', endTime: '16:30' },
    { id: 'item-4', label: 'Spiel 3', startTime: '16:45', endTime: '19:45' },
    { id: 'item-5', label: 'Siegerehrung', startTime: '19:45', endTime: '20:00' },
  ],
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [allSettings, setAllSettings] = useState(() => {
    const loaded = loadAllSettings();
    return { ...DEFAULT_SETTINGS, ...loaded };
  });

  const {
    tournamentName,
    logoPath,
    headerVisible,
    headerHeight,
    currentGame,
    scheduleVisible,
    scheduleItems,
    scheduleHeight,
  } = allSettings;

  // Debounced save to localStorage
  const debouncedSave = useMemo(() => {
    let timeoutId: number;
    return (settings: typeof allSettings) => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        try {
          localStorage.setItem('countdownDisplaySettings', JSON.stringify(settings));
        } catch (error) {
          console.warn('Failed to save settings to localStorage:', error);
        }
      }, 100);
    };
  }, []);

  useEffect(() => {
    debouncedSave(allSettings);
  }, [allSettings, debouncedSave]);

  // Setter creators
  const createSetter = useCallback(<K extends keyof typeof allSettings>(
    key: K
  ) => {
    return (value: typeof allSettings[K]) => {
      setAllSettings(prev => ({ ...prev, [key]: value }));
    };
  }, []);

  const setTournamentName = useMemo(() => createSetter('tournamentName'), [createSetter]);
  const setLogoPath = useMemo(() => createSetter('logoPath'), [createSetter]);
  const setHeaderVisible = useMemo(() => createSetter('headerVisible'), [createSetter]);
  const setHeaderHeight = useMemo(() => createSetter('headerHeight'), [createSetter]);
  const setCurrentGame = useMemo(() => createSetter('currentGame'), [createSetter]);
  const setScheduleVisible = useMemo(() => createSetter('scheduleVisible'), [createSetter]);
  const setScheduleItems = useMemo(() => createSetter('scheduleItems'), [createSetter]);
  const setScheduleHeight = useMemo(() => createSetter('scheduleHeight'), [createSetter]);

  const value: Settings = useMemo(() => ({
    tournamentName,
    logoPath,
    headerVisible,
    headerHeight,
    currentGame,
    scheduleVisible,
    scheduleItems,
    scheduleHeight,
    setTournamentName,
    setLogoPath,
    setHeaderVisible,
    setHeaderHeight,
    setCurrentGame,
    setScheduleVisible,
    setScheduleItems,
    setScheduleHeight,
  }), [
    tournamentName,
    logoPath,
    headerVisible,
    headerHeight,
    currentGame,
    scheduleVisible,
    scheduleItems,
    scheduleHeight,
    setTournamentName,
    setLogoPath,
    setHeaderVisible,
    setHeaderHeight,
    setCurrentGame,
    setScheduleVisible,
    setScheduleItems,
    setScheduleHeight,
  ]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): Settings {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('SettingsProvider is missing');
  return ctx;
}
