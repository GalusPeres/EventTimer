import { ScheduleItem } from '../context/SettingsContext';

// Default values for all settings
export const DEFAULT_COUNTDOWN_MODE = 'duration';
export const DEFAULT_COUNTDOWN_HOURS = 3;
export const DEFAULT_COUNTDOWN_MINUTES = 0;
export const DEFAULT_COUNTDOWN_TARGET_TIME = '12:30';
export const DEFAULT_PROGRESS_BAR_LIMIT_ENABLED = true;
export const DEFAULT_PROGRESS_BAR_LIMIT_HOURS = 3;
export const DEFAULT_PROGRESS_BAR_LIMIT_MINUTES = 0;

export const DEFAULT_TOURNAMENT_NAME = 'WAIDLER TOURNAMENT';
export const DEFAULT_LOGO_PATH = '';
export const DEFAULT_LOGO_ORIGINAL_PATH = '';
export const DEFAULT_HEADER_VISIBLE = true;
export const DEFAULT_HEADER_HEIGHT = 100;
export const DEFAULT_HEADER_TEXT_BOLD = false;
export const DEFAULT_HEADER_TEXT_SIZE = 100;

export const DEFAULT_SCHEDULE_ITEMS: ScheduleItem[] = [
  { id: 'item-1', label: 'Spiel 1', startTime: '09:30', endTime: '12:30' },
  { id: 'item-2', label: 'Mittagspause', startTime: '12:30', endTime: '13:30' },
  { id: 'item-3', label: 'Spiel 2', startTime: '13:30', endTime: '16:30' },
  { id: 'item-4', label: 'Spiel 3', startTime: '16:45', endTime: '19:45' },
  { id: 'item-5', label: 'Siegerehrung', startTime: '19:45', endTime: '20:00' },
];
export const DEFAULT_SCHEDULE_HEIGHT = 100;
export const DEFAULT_SCHEDULE_VISIBLE = true;

// Check if countdown settings are at defaults
export function isCountdownAtDefaults(
  mode: string,
  hours: number,
  minutes: number,
  targetTime: string,
  limitEnabled: boolean,
  limitHours: number,
  limitMinutes: number
): boolean {
  return (
    mode === DEFAULT_COUNTDOWN_MODE &&
    hours === DEFAULT_COUNTDOWN_HOURS &&
    minutes === DEFAULT_COUNTDOWN_MINUTES &&
    targetTime === DEFAULT_COUNTDOWN_TARGET_TIME &&
    limitEnabled === DEFAULT_PROGRESS_BAR_LIMIT_ENABLED &&
    limitHours === DEFAULT_PROGRESS_BAR_LIMIT_HOURS &&
    limitMinutes === DEFAULT_PROGRESS_BAR_LIMIT_MINUTES
  );
}

// Check if header settings are at defaults
export function isHeaderAtDefaults(
  tournamentName: string,
  logoPath: string,
  logoOriginalPath: string,
  headerVisible: boolean,
  headerHeight: number,
  headerTextBold: boolean,
  headerTextSize: number
): boolean {
  return (
    tournamentName === DEFAULT_TOURNAMENT_NAME &&
    logoPath === DEFAULT_LOGO_PATH &&
    logoOriginalPath === DEFAULT_LOGO_ORIGINAL_PATH &&
    headerVisible === DEFAULT_HEADER_VISIBLE &&
    headerHeight === DEFAULT_HEADER_HEIGHT &&
    headerTextBold === DEFAULT_HEADER_TEXT_BOLD &&
    headerTextSize === DEFAULT_HEADER_TEXT_SIZE
  );
}

// Check if schedule settings are at defaults
export function isScheduleAtDefaults(
  scheduleItems: ScheduleItem[],
  scheduleHeight: number,
  scheduleVisible: boolean
): boolean {
  if (scheduleItems.length !== DEFAULT_SCHEDULE_ITEMS.length) return false;
  if (scheduleHeight !== DEFAULT_SCHEDULE_HEIGHT) return false;
  if (scheduleVisible !== DEFAULT_SCHEDULE_VISIBLE) return false;

  // Compare each item
  for (let i = 0; i < scheduleItems.length; i++) {
    const item = scheduleItems[i];
    const defaultItem = DEFAULT_SCHEDULE_ITEMS[i];

    if (
      item.label !== defaultItem.label ||
      item.startTime !== defaultItem.startTime ||
      item.endTime !== defaultItem.endTime
    ) {
      return false;
    }
  }

  return true;
}
