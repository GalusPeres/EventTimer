import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import TimerTab from './TimerTab';
import ScheduleTab from './ScheduleTab';
import TournamentTab from './TournamentTab';
import AboutTab from './AboutTab';
import ConfirmModal from '../ConfirmModal';

type Props = {
  visible: boolean;
  onClose(): void;
  countdownActive: boolean;
  onStartCountdown(mode: 'duration' | 'target', hours?: number, minutes?: number, targetTime?: string): void;
  onResetCountdown(): void;
  remainingTime?: string;
  countdownStartTime?: Date | null;
  targetDate?: Date | null;
};

export default function SettingsModal({
  visible,
  onClose,
  countdownActive,
  onStartCountdown,
  onResetCountdown,
  remainingTime,
  countdownStartTime,
  targetDate,
}: Props) {
  const settings = useSettings();
  const [tab, setTab] = useState<'countdown' | 'schedule' | 'header' | 'about'>('countdown');

  // Timer tab state
  const [mode, setMode] = useState<'duration' | 'target'>('duration');
  const [hours, setHours] = useState<number>(3);
  const [minutes, setMinutes] = useState<number>(15);
  const [targetTime, setTargetTime] = useState<string>('17:00');

  // Confirm modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'stop' | 'reset' | 'resetSchedule' | 'resetTournament' | null>(null);

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
    if (confirmAction === 'stop' || confirmAction === 'reset') {
      onResetCountdown();
      // Reset timer settings to defaults when stopping/resetting
      setMode('duration');
      setHours(3);
      setMinutes(15);
      setTargetTime('17:00');
    } else if (confirmAction === 'resetSchedule') {
      const defaultItems = [
        { id: 'item-1', label: 'SPIEL 1', startTime: '09:30', endTime: '12:45' },
        { id: 'item-2', label: 'MITTAGSPAUSE', startTime: '12:45', endTime: '13:45' },
        { id: 'item-3', label: 'SPIEL 2', startTime: '13:45', endTime: '17:00' },
        { id: 'item-4', label: 'SPIEL 3', startTime: '17:05', endTime: '20:20' },
        { id: 'item-5', label: 'SIEGEREHRUNG', startTime: '20:30', endTime: '23:59' },
      ];
      settings.setScheduleItems(defaultItems);
    } else if (confirmAction === 'resetTournament') {
      settings.setTournamentName('WAIDLER TOURNAMENT');
      settings.setLogoPath('');
      settings.setHeaderVisible(true);
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
          w-[32rem] max-w-[90vw]
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
            />
          ) : tab === 'schedule' ? (
            <ScheduleTab onFooterRender={setScheduleFooter} />
          ) : tab === 'header' ? (
            <TournamentTab />
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
                    if (countdownActive) {
                      setConfirmAction('reset');
                      setShowConfirm(true);
                    } else {
                      onResetCountdown();
                      // Reset timer settings to defaults
                      setMode('duration');
                      setHours(3);
                      setMinutes(15);
                      setTargetTime('17:00');
                    }
                  }}
                  className="px-6 py-2 bg-gradient-to-br from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 border border-blue-500/30 text-white rounded-xl transition-all"
                >
                  Reset
                </button>
              </>
            );
          })()}

          {tab === 'schedule' && scheduleFooter}

          {tab === 'header' && (
            <button
              onClick={() => {
                setConfirmAction('resetTournament');
                setShowConfirm(true);
              }}
              className="px-6 py-2 bg-gradient-to-br from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 border border-blue-500/30 text-white rounded-xl transition-all"
            >
              Reset
            </button>
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
    </div>
  );
}
