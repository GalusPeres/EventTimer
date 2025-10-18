import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { SimpleSelect } from '../SimpleSelect';

type Props = {
  mode: 'duration' | 'target';
  setMode: (mode: 'duration' | 'target') => void;
  hours: number;
  setHours: (hours: number) => void;
  minutes: number;
  setMinutes: (minutes: number) => void;
  targetTime: string;
  setTargetTime: (time: string) => void;
  countdownActive: boolean;
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

export default function TimerTab({ mode, setMode, hours, setHours, minutes, setMinutes, targetTime, setTargetTime, countdownActive, remainingTime, countdownStartTime, targetDate, progressBarLimitEnabled, setProgressBarLimitEnabled, progressBarLimitHours, setProgressBarLimitHours, progressBarLimitMinutes, setProgressBarLimitMinutes }: Props) {
  const settings = useSettings();

  return (
    <>
      <style>{`
        /* Hide default number input spinners */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      <div className="space-y-5">
        {/* Schedule Item Selection */}
        <div>
          <div className="mb-3 text-base text-white">Phase auswählen</div>
          <SimpleSelect
            options={settings.scheduleItems.map((item, index) => ({
              value: String(index + 1),
              label: item.label,
            }))}
            value={String(settings.currentGame)}
            onChange={(v) => settings.setCurrentGame(Number(v))}
          />
        </div>

        {/* Countdown Settings */}
        <div>
          <div className="mb-3 text-base text-white">Countdown stellen</div>

            <div className="flex items-center gap-4">
              {/* Mode Buttons */}
              <button
                onClick={() => setMode('duration')}
                className={`px-3 py-1 rounded-full border text-sm transition-all ${
                  mode === 'duration'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-500 border-blue-500 text-white'
                    : 'bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 border-zinc-600/50 text-white/80 hover:text-white hover:from-zinc-700/70 hover:to-zinc-600/70'
                } focus:outline-none`}
              >
                Nach Dauer
              </button>
              <button
                onClick={() => setMode('target')}
                className={`px-3 py-1 rounded-full border text-sm transition-all ${
                  mode === 'target'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-500 border-blue-500 text-white'
                    : 'bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 border-zinc-600/50 text-white/80 hover:text-white hover:from-zinc-700/70 hover:to-zinc-600/70'
                } focus:outline-none`}
              >
                Bis Uhrzeit
              </button>

              {/* Inputs in same row */}
              {mode === 'duration' && (
                <div className="flex gap-4 items-end ml-auto">
                  <div>
                    <div className="mb-1 text-xs text-white/60">Stunden:</div>
                    <div className="relative w-20">
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={hours}
                        onChange={(e) => setHours(Number(e.target.value))}
                        className="w-full h-9 px-2 pr-8 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        style={{ lineHeight: '36px' }}
                      />
                      <div className="absolute right-1 top-0 h-full flex flex-col justify-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => setHours(Math.min(23, hours + 1))}
                          className="w-6 h-3.5 flex items-center justify-center text-white/60 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setHours(Math.max(0, hours - 1))}
                          className="w-6 h-3.5 flex items-center justify-center text-white/60 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-white/60">Minuten:</div>
                    <div className="relative w-20">
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={minutes}
                        onChange={(e) => setMinutes(Number(e.target.value))}
                        className="w-full h-9 px-2 pr-8 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        style={{ lineHeight: '36px' }}
                      />
                      <div className="absolute right-1 top-0 h-full flex flex-col justify-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => setMinutes(Math.min(59, minutes + 1))}
                          className="w-6 h-3.5 flex items-center justify-center text-white/60 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMinutes(Math.max(0, minutes - 1))}
                          className="w-6 h-3.5 flex items-center justify-center text-white/60 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Target Time Mode Input */}
              {mode === 'target' && (
                <div className="ml-auto">
                  <div className="mb-1 text-xs text-white/60">Zielzeit:</div>
                  <input
                    type="time"
                    value={targetTime}
                    onChange={(e) => setTargetTime(e.target.value)}
                    className="w-32 h-9 px-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              )}
            </div>
        </div>

        {/* Progress Bar Limit */}
        <div>
          <div className="mb-3 text-base text-white">Fortschrittsbalken</div>
          <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => setProgressBarLimitEnabled(!progressBarLimitEnabled)}
                className={`
                  w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all
                  ${progressBarLimitEnabled
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-500 border-blue-500'
                    : 'bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 border-zinc-600/50 hover:from-zinc-700/70 hover:to-zinc-600/70 hover:border-zinc-500/70'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50
                `}
              >
                {progressBarLimitEnabled && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span
                onClick={() => setProgressBarLimitEnabled(!progressBarLimitEnabled)}
                className="text-sm cursor-pointer select-none"
              >
                Balken auf maximale Dauer begrenzen
              </span>
          </div>
          {progressBarLimitEnabled && (
              <div>
                <div className="mb-2 text-xs text-white/60">Maximale Anzeige-Dauer:</div>
                <div className="flex gap-4 items-end">
                  <div>
                    <div className="mb-1 text-xs text-white/60">Stunden:</div>
                    <div className="relative w-20">
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={progressBarLimitHours}
                        onChange={(e) => setProgressBarLimitHours(Number(e.target.value))}
                        className="w-full h-9 px-2 pr-8 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        style={{ lineHeight: '36px' }}
                      />
                      <div className="absolute right-1 top-0 h-full flex flex-col justify-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => setProgressBarLimitHours(Math.min(23, progressBarLimitHours + 1))}
                          className="w-6 h-3.5 flex items-center justify-center text-white/60 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setProgressBarLimitHours(Math.max(0, progressBarLimitHours - 1))}
                          className="w-6 h-3.5 flex items-center justify-center text-white/60 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-white/60">Minuten:</div>
                    <div className="relative w-20">
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={progressBarLimitMinutes}
                        onChange={(e) => setProgressBarLimitMinutes(Number(e.target.value))}
                        className="w-full h-9 px-2 pr-8 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        style={{ lineHeight: '36px' }}
                      />
                      <div className="absolute right-1 top-0 h-full flex flex-col justify-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => setProgressBarLimitMinutes(Math.min(59, progressBarLimitMinutes + 1))}
                          className="w-6 h-3.5 flex items-center justify-center text-white/60 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setProgressBarLimitMinutes(Math.max(0, progressBarLimitMinutes - 1))}
                          className="w-6 h-3.5 flex items-center justify-center text-white/60 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}
        </div>

        {/* Info Display */}
        <InfoBox
          countdownActive={countdownActive}
          mode={mode}
          hours={hours}
          minutes={minutes}
          targetTime={targetTime}
          remainingTime={remainingTime}
          countdownStartTime={countdownStartTime}
          targetDate={targetDate}
          progressBarLimitEnabled={progressBarLimitEnabled}
          progressBarLimitHours={progressBarLimitHours}
          progressBarLimitMinutes={progressBarLimitMinutes}
        />
      </div>
    </>
  );
}

// Info Box Component
function InfoBox({ countdownActive, mode, hours, minutes, targetTime, remainingTime, countdownStartTime, targetDate, progressBarLimitEnabled, progressBarLimitHours, progressBarLimitMinutes }: {
  countdownActive: boolean;
  mode: 'duration' | 'target';
  hours: number;
  minutes: number;
  targetTime: string;
  remainingTime?: string;
  countdownStartTime?: Date | null;
  targetDate?: Date | null;
  progressBarLimitEnabled: boolean;
  progressBarLimitHours: number;
  progressBarLimitMinutes: number;
}) {
  const [currentTime, setCurrentTime] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate target time
  const calculateTargetTime = () => {
    const now = new Date();
    if (mode === 'duration') {
      const target = new Date(now.getTime() + (hours * 60 * 60 + minutes * 60) * 1000);
      return target.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    } else {
      return targetTime;
    }
  };

  return (
    <div className="w-52 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg space-y-3 flex-shrink-0">
      <div className="text-sm font-semibold text-white/80 mb-3">Info</div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Aktuelle Uhrzeit:</span>
          <span className="font-medium">{currentTime}</span>
        </div>

        {!countdownActive && (
          <div className="flex justify-between">
            <span className="text-white/60">Voraussichtl. Ziel:</span>
            <span className="font-medium">{calculateTargetTime()}</span>
          </div>
        )}

        {countdownActive && (
          <>
            <div className="flex justify-between">
              <span className="text-white/60">Countdown:</span>
              <span className="font-medium">{remainingTime || '--:--:--'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Startzeit:</span>
              <span className="font-medium">
                {countdownStartTime ? countdownStartTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Zielzeit:</span>
              <span className="font-medium">
                {targetDate ? targetDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </span>
            </div>
          </>
        )}

        {progressBarLimitEnabled && (
          <div className="flex justify-between pt-2 border-t border-zinc-700/50">
            <span className="text-white/60">Balken-Limit:</span>
            <span className="font-medium">
              {progressBarLimitHours > 0 && `${progressBarLimitHours}h`}
              {progressBarLimitHours > 0 && progressBarLimitMinutes > 0 && ' '}
              {progressBarLimitMinutes > 0 && `${progressBarLimitMinutes}min`}
              {progressBarLimitHours === 0 && progressBarLimitMinutes === 0 && '0min'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
