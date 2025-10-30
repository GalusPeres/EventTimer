import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import TimerTab from './TimerTab';
import ScheduleTab from './ScheduleTab';
import HeaderTab from './HeaderTab';
import AboutTab from './AboutTab';
import ConfirmModal from '../ConfirmModal';
import LogoEditorModal from '../LogoEditorModal';
import {
  DEFAULT_COUNTDOWN_MODE,
  DEFAULT_COUNTDOWN_HOURS,
  DEFAULT_COUNTDOWN_MINUTES,
  DEFAULT_COUNTDOWN_TARGET_TIME,
  DEFAULT_PROGRESS_BAR_LIMIT_ENABLED,
  DEFAULT_PROGRESS_BAR_LIMIT_HOURS,
  DEFAULT_PROGRESS_BAR_LIMIT_MINUTES,
  DEFAULT_TOURNAMENT_NAME,
  DEFAULT_LOGO_PATH,
  DEFAULT_LOGO_ORIGINAL_PATH,
  DEFAULT_HEADER_VISIBLE,
  DEFAULT_HEADER_HEIGHT,
  DEFAULT_HEADER_TEXT_BOLD,
  DEFAULT_HEADER_TEXT_SIZE,
  DEFAULT_SCHEDULE_ITEMS,
  DEFAULT_SCHEDULE_HEIGHT,
  DEFAULT_SCHEDULE_VISIBLE,
  isCountdownAtDefaults,
  isHeaderAtDefaults,
  isScheduleAtDefaults,
} from '../../utils/settingsDefaults';

type Props = {
  visible: boolean;
  onClose(): void;
  countdownActive: boolean;
  onStartCountdown(mode: 'duration' | 'target', hours?: number, minutes?: number, targetTime?: string): void;
  onResetCountdown(): void;
  remainingTime?: string;
  countdownStartTime?: Date | null;
  targetDate?: Date | null;
  progressBarLimitEnabled: boolean;
  setProgressBarLimitEnabled: (enabled: boolean) => void;
  progressBarLimitHours: number;
  setProgressBarLimitHours: (hours: number) => void;
  progressBarLimitMinutes: number;
  setProgressBarLimitMinutes: (minutes: number) => void;
};

const SettingsModal = React.memo(function SettingsModal({
  visible,
  onClose,
  countdownActive,
  onStartCountdown,
  onResetCountdown,
  remainingTime,
  countdownStartTime,
  targetDate,
  progressBarLimitEnabled,
  setProgressBarLimitEnabled,
  progressBarLimitHours,
  setProgressBarLimitHours,
  progressBarLimitMinutes,
  setProgressBarLimitMinutes,
}: Props) {
  const settings = useSettings();
  const [tab, setTab] = useState<'countdown' | 'schedule' | 'header' | 'about'>('countdown');

  // Use settings from context instead of local state
  const mode = settings.countdownMode;
  const setMode = settings.setCountdownMode;
  const hours = settings.countdownHours;
  const setHours = settings.setCountdownHours;
  const minutes = settings.countdownMinutes;
  const setMinutes = settings.setCountdownMinutes;
  const targetTime = settings.countdownTargetTime;
  const setTargetTime = settings.setCountdownTargetTime;

  // Confirm modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'stop' | 'reset' | 'resetSchedule' | 'resetTournament' | null>(null);

  // Logo editor state
  const [showLogoEditor, setShowLogoEditor] = useState(false);
  const [logoEditorImage, setLogoEditorImage] = useState('');

  // Schedule footer content
  const [scheduleFooter, setScheduleFooter] = useState<React.ReactNode>(null);

  // Get button text and action
  const getTimerButtonState = () => {
    if (!countdownActive) {
      return { text: 'Start', action: () => {
        if (mode === 'duration') {
          onStartCountdown('duration', hours, minutes);
        } else {
          onStartCountdown('target', undefined, undefined, targetTime);
        }
      }, disabled: false };
    } else {
      return { text: 'Stop', action: () => {
        setConfirmAction('stop');
        setShowConfirm(true);
      }, disabled: false };
    }
  };

  const handleConfirmAction = () => {
    if (confirmAction === 'stop') {
      // Stop only stops the countdown, doesn't reset settings
      onResetCountdown();
    } else if (confirmAction === 'reset') {
      // Reset stops countdown AND resets settings to defaults
      onResetCountdown();
      settings.setCountdownMode(DEFAULT_COUNTDOWN_MODE);
      settings.setCountdownHours(DEFAULT_COUNTDOWN_HOURS);
      settings.setCountdownMinutes(DEFAULT_COUNTDOWN_MINUTES);
      settings.setCountdownTargetTime(DEFAULT_COUNTDOWN_TARGET_TIME);
      setProgressBarLimitEnabled(DEFAULT_PROGRESS_BAR_LIMIT_ENABLED);
      setProgressBarLimitHours(DEFAULT_PROGRESS_BAR_LIMIT_HOURS);
      setProgressBarLimitMinutes(DEFAULT_PROGRESS_BAR_LIMIT_MINUTES);
    } else if (confirmAction === 'resetSchedule') {
      settings.setScheduleItems(DEFAULT_SCHEDULE_ITEMS);
      settings.setScheduleHeight(DEFAULT_SCHEDULE_HEIGHT);
      settings.setScheduleVisible(DEFAULT_SCHEDULE_VISIBLE);
    } else if (confirmAction === 'resetTournament') {
      settings.setTournamentName(DEFAULT_TOURNAMENT_NAME);
      settings.setLogoPath(DEFAULT_LOGO_PATH);
      settings.setLogoOriginalPath(DEFAULT_LOGO_ORIGINAL_PATH);
      settings.setHeaderVisible(DEFAULT_HEADER_VISIBLE);
      settings.setHeaderHeight(DEFAULT_HEADER_HEIGHT);
      settings.setHeaderTextBold(DEFAULT_HEADER_TEXT_BOLD);
      settings.setHeaderTextSize(DEFAULT_HEADER_TEXT_SIZE);
    }
    setShowConfirm(false);
    setConfirmAction(null);
  };

  const getConfirmMessage = () => {
    if (confirmAction === 'stop') return 'Countdown wirklich stoppen?';
    if (confirmAction === 'reset') return 'Countdown wirklich zurücksetzen?';
    if (confirmAction === 'resetSchedule') return 'Zeitplan auf Standardwerte zurücksetzen?';
    if (confirmAction === 'resetTournament') return 'Turniername auf Standardwert zurücksetzen?';
    return '';
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className="
          bg-gradient-to-br from-blue-900/70 to-green-900/70
          backdrop-blur-xl
          rounded-2xl
          border border-zinc-700
          shadow-[0_0_70px_rgba(0,0,0,0.8)]
          w-[30rem] max-w-[90vw]
          h-[36rem] max-h-[90vh]
          flex flex-col overflow-hidden
          animate-fade-in
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header + Tab Navigation */}
        <div className="relative">
          {/* Active tab overlay */}
          {tab === 'countdown' && (
            <div className="absolute bottom-0 left-0 w-1/4 h-[2.5rem] bg-zinc-900/75 rounded-tr-lg"></div>
          )}
          {tab === 'schedule' && (
            <div className="absolute bottom-0 left-1/4 w-1/4 h-[2.5rem] bg-zinc-900/75 rounded-t-lg"></div>
          )}
          {tab === 'header' && (
            <div className="absolute bottom-0 left-2/4 w-1/4 h-[2.5rem] bg-zinc-900/75 rounded-t-lg"></div>
          )}
          {tab === 'about' && (
            <div className="absolute bottom-0 left-3/4 w-1/4 h-[2.5rem] bg-zinc-900/75 rounded-tl-lg"></div>
          )}

          {/* Header */}
          <div className="flex justify-between items-center px-6 py-3 no-drag relative">
            <h3 className="text-white text-lg">Einstellungen</h3>
            <button
              onClick={onClose}
              className="p-1 no-drag text-white/80 hover:text-white focus:outline-none transform transition-transform duration-200 ease-out hover:scale-130 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex relative no-drag" role="tablist">
            {/* Border lines */}
            {tab !== 'countdown' && (
              <div className="absolute bottom-0 left-0 w-1/4 h-px bg-zinc-600/40"></div>
            )}
            {tab !== 'schedule' && (
              <div className="absolute bottom-0 left-1/4 w-1/4 h-px bg-zinc-600/40"></div>
            )}
            {tab !== 'header' && (
              <div className="absolute bottom-0 left-2/4 w-1/4 h-px bg-zinc-600/40"></div>
            )}
            {tab !== 'about' && (
              <div className="absolute bottom-0 left-3/4 w-1/4 h-px bg-zinc-600/40"></div>
            )}

            {/* Border frames */}
            {tab === 'countdown' && (
              <div className="absolute top-0 left-0 w-1/4 h-full border-t border-r border-zinc-600/40 rounded-tr-lg"></div>
            )}
            {tab === 'schedule' && (
              <div className="absolute top-0 left-1/4 w-1/4 h-full border-t border-l border-r border-zinc-600/40 rounded-t-lg"></div>
            )}
            {tab === 'header' && (
              <div className="absolute top-0 left-2/4 w-1/4 h-full border-t border-l border-r border-zinc-600/40 rounded-t-lg"></div>
            )}
            {tab === 'about' && (
              <div className="absolute top-0 left-3/4 w-1/4 h-full border-t border-l border-zinc-600/40 rounded-tl-lg"></div>
            )}

            <button
              role="tab"
              aria-selected={tab === 'countdown'}
              onClick={() => setTab('countdown')}
              className={`flex-1 py-2 text-center ${
                tab === 'countdown'
                  ? 'text-white relative z-10 rounded-tr-lg'
                  : 'text-white/60 hover:text-white hover:bg-zinc-700/60 rounded-tr-lg'
              } focus:outline-none transition-all`}
            >
              Countdown
            </button>
            <button
              role="tab"
              aria-selected={tab === 'schedule'}
              onClick={() => setTab('schedule')}
              className={`flex-1 py-2 text-center ${
                tab === 'schedule'
                  ? 'text-white relative z-10'
                  : 'text-white/60 hover:text-white hover:bg-zinc-700/60'
              } focus:outline-none transition-all rounded-t-lg`}
            >
              Zeitplan
            </button>
            <button
              role="tab"
              aria-selected={tab === 'header'}
              onClick={() => setTab('header')}
              className={`flex-1 py-2 text-center ${
                tab === 'header'
                  ? 'text-white relative z-10'
                  : 'text-white/60 hover:text-white hover:bg-zinc-700/60'
              } focus:outline-none transition-all rounded-t-lg`}
            >
              Kopfzeile
            </button>
            <button
              role="tab"
              aria-selected={tab === 'about'}
              onClick={() => setTab('about')}
              className={`flex-1 py-2 text-center ${
                tab === 'about'
                  ? 'text-white relative z-10 rounded-tl-lg'
                  : 'text-white/60 hover:text-white hover:bg-zinc-700/60 rounded-tl-lg'
              } focus:outline-none transition-all`}
            >
              Über
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 flex-1 overflow-auto text-white scrollbar-thin bg-zinc-900/75">
          {tab === 'countdown' ? (
            <TimerTab
              mode={mode}
              setMode={setMode}
              hours={hours}
              setHours={setHours}
              minutes={minutes}
              setMinutes={setMinutes}
              targetTime={targetTime}
              setTargetTime={setTargetTime}
              countdownActive={countdownActive}
              remainingTime={remainingTime}
              countdownStartTime={countdownStartTime}
              targetDate={targetDate}
              progressBarLimitEnabled={progressBarLimitEnabled}
              setProgressBarLimitEnabled={setProgressBarLimitEnabled}
              progressBarLimitHours={progressBarLimitHours}
              setProgressBarLimitHours={setProgressBarLimitHours}
              progressBarLimitMinutes={progressBarLimitMinutes}
              setProgressBarLimitMinutes={setProgressBarLimitMinutes}
            />
          ) : tab === 'schedule' ? (
            <ScheduleTab
              onFooterRender={setScheduleFooter}
            />
          ) : tab === 'header' ? (
            <HeaderTab
              onOpenLogoEditor={(imageSrc) => {
                setLogoEditorImage(imageSrc);
                setShowLogoEditor(true);
              }}
            />
          ) : (
            <AboutTab />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 relative flex justify-center gap-3 no-drag bg-zinc-900/75">
          <div className="absolute top-0 left-4 right-4 border-t-2 border-zinc-600/40"></div>

          {tab === 'countdown' && (() => {
            const buttonState = getTimerButtonState();
            return (
              <>
                <button
                  onClick={buttonState.action}
                  disabled={buttonState.disabled}
                  className={`px-6 py-2 rounded-xl transition-all ${
                    !countdownActive
                      ? 'bg-gradient-to-br from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 border border-green-500/30 text-white'
                      : 'bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border border-red-500/30 text-white'
                  }`}
                >
                  {buttonState.text}
                </button>
                <button
                  onClick={() => {
                    // Check if countdown settings were changed from default
                    const atDefaults = isCountdownAtDefaults(
                      settings.countdownMode,
                      settings.countdownHours,
                      settings.countdownMinutes,
                      settings.countdownTargetTime,
                      progressBarLimitEnabled,
                      progressBarLimitHours,
                      progressBarLimitMinutes
                    );

                    if (countdownActive || !atDefaults) {
                      setConfirmAction('reset');
                      setShowConfirm(true);
                    } else {
                      // Already at default and not active, just reset
                      onResetCountdown();
                      settings.setCountdownMode(DEFAULT_COUNTDOWN_MODE);
                      settings.setCountdownHours(DEFAULT_COUNTDOWN_HOURS);
                      settings.setCountdownMinutes(DEFAULT_COUNTDOWN_MINUTES);
                      settings.setCountdownTargetTime(DEFAULT_COUNTDOWN_TARGET_TIME);
                      setProgressBarLimitEnabled(DEFAULT_PROGRESS_BAR_LIMIT_ENABLED);
                      setProgressBarLimitHours(DEFAULT_PROGRESS_BAR_LIMIT_HOURS);
                      setProgressBarLimitMinutes(DEFAULT_PROGRESS_BAR_LIMIT_MINUTES);
                    }
                  }}
                  className="px-4 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 border border-blue-500/30 text-white rounded-xl transition-all"
                >
                  Reset
                </button>
              </>
            );
          })()}

          {tab === 'schedule' && (
            <>
              {scheduleFooter}
              <button
                onClick={() => {
                  // Check if schedule settings were changed from default
                  const atDefaults = isScheduleAtDefaults(
                    settings.scheduleItems,
                    settings.scheduleHeight,
                    settings.scheduleVisible
                  );

                  if (!atDefaults) {
                    setConfirmAction('resetSchedule');
                    setShowConfirm(true);
                  } else {
                    // Already at defaults, just reset
                    settings.setScheduleItems(DEFAULT_SCHEDULE_ITEMS);
                    settings.setScheduleHeight(DEFAULT_SCHEDULE_HEIGHT);
                    settings.setScheduleVisible(DEFAULT_SCHEDULE_VISIBLE);
                  }
                }}
                className="px-4 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 border border-blue-500/30 text-white rounded-xl transition-all"
              >
                Reset
              </button>
            </>
          )}

          {tab === 'header' && (
            <button
              onClick={() => {
                // Check if header was changed from default
                const atDefaults = isHeaderAtDefaults(
                  settings.tournamentName,
                  settings.logoPath,
                  settings.logoOriginalPath,
                  settings.headerVisible,
                  settings.headerHeight,
                  settings.headerTextBold,
                  settings.headerTextSize
                );

                if (!atDefaults) {
                  setConfirmAction('resetTournament');
                  setShowConfirm(true);
                } else {
                  // Already at default, just reset
                  settings.setTournamentName(DEFAULT_TOURNAMENT_NAME);
                  settings.setLogoPath(DEFAULT_LOGO_PATH);
                  settings.setLogoOriginalPath(DEFAULT_LOGO_ORIGINAL_PATH);
                  settings.setHeaderVisible(DEFAULT_HEADER_VISIBLE);
                  settings.setHeaderHeight(DEFAULT_HEADER_HEIGHT);
                  settings.setHeaderTextBold(DEFAULT_HEADER_TEXT_BOLD);
                  settings.setHeaderTextSize(DEFAULT_HEADER_TEXT_SIZE);
                }
              }}
              className="px-4 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 border border-blue-500/30 text-white rounded-xl transition-all"
            >
              Reset
            </button>
          )}

          {tab === 'about' && (
            <div className="flex flex-col items-center space-y-3 w-full">
              <p className="text-white/40 text-xs">
                Licensed under MIT License
              </p>
              <p className="text-white/40 text-xs">
                © 2025 GalusPeres. All rights reserved.
              </p>
              <div className="flex gap-4 justify-center text-xs">
                <button
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  onClick={() => {
                    if (window.electronAPI?.openExternal) {
                      window.electronAPI.openExternal('https://github.com/GalusPeres/EventTimer/blob/main/LICENSE');
                    }
                  }}
                >
                  View License
                </button>
                <button
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  onClick={() => {
                    if (window.electronAPI?.openExternal) {
                      window.electronAPI.openExternal('https://github.com/GalusPeres/EventTimer/issues/new');
                    }
                  }}
                >
                  Report Bug
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        visible={showConfirm}
        title="Bestätigung"
        message={getConfirmMessage()}
        confirmText="Ja"
        cancelText="Abbrechen"
        onConfirm={handleConfirmAction}
        onCancel={() => {
          setShowConfirm(false);
          setConfirmAction(null);
        }}
      />

      {/* Logo Editor Modal */}
      <LogoEditorModal
        visible={showLogoEditor}
        imageSrc={logoEditorImage}
        onClose={() => setShowLogoEditor(false)}
        onSave={(croppedImage) => {
          // If original wasn't set (using default), set it now
          if (!settings.logoOriginalPath) {
            settings.setLogoOriginalPath(logoEditorImage);
          }
          settings.setLogoPath(croppedImage);
          setShowLogoEditor(false);
        }}
      />
    </div>
  );
});

export default SettingsModal;
