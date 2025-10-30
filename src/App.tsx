import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSettings } from './context/SettingsContext';
import SettingsModal from './components/SettingsModal/SettingsModal';
import ConfirmModal from './components/ConfirmModal';
import DragBar from './components/DragBar';
import HoverControls from './components/HoverControls';
import logo from './assets/logo.png';

declare global {
  interface Window {
    electronAPI: {
      toggleFullscreen: () => Promise<boolean>;
      isFullscreen: () => Promise<boolean>;
      closeApp: () => void;
      openExternal: (url: string) => void;
    };
  }
}

export default function App() {
  const settings = useSettings();

  // Countdown State
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>('');
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownStartTime, setCountdownStartTime] = useState<Date | null>(null);
  const [countdownDuration, setCountdownDuration] = useState<number>(0);

  // UI State
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hideCursor, setHideCursor] = useState(false);
  const [mouseInside, setMouseInside] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const cursorTimeoutRef = useRef<number>();

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-reset "ist beendet" message after 5 minutes
  useEffect(() => {
    if (!countdownActive && remainingTime) {
      const timer = setTimeout(() => {
        setRemainingTime('');
      }, 5 * 60 * 1000); // 5 minutes
      return () => clearTimeout(timer);
    }
  }, [countdownActive, remainingTime]);

  // Fullscreen detection
  useEffect(() => {
    const checkFullscreen = async () => {
      const isFull = await window.electronAPI.isFullscreen();
      setIsFullscreen(isFull);
    };

    // Check immediately
    checkFullscreen();

    // Check again after a short delay (macOS sometimes needs this)
    const timer = setTimeout(() => {
      checkFullscreen();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Cursor auto-hide
  const resetCursorTimer = useCallback(() => {
    setHideCursor(false);
    setMouseInside(true);
    clearTimeout(cursorTimeoutRef.current);
    cursorTimeoutRef.current = window.setTimeout(() => {
      setHideCursor(true);
    }, 5000);
  }, []);

  useEffect(() => {
    let throttleTimeout: number | null = null;

    const onMove = () => {
      if (!throttleTimeout) {
        throttleTimeout = window.setTimeout(() => {
          throttleTimeout = null;
        }, 100);
        resetCursorTimer();
      }
    };

    const onClick = resetCursorTimer;
    const onLeave = () => {
      setHideCursor(true);
      setMouseInside(false);
      clearTimeout(cursorTimeoutRef.current);
    };
    const onEnter = () => {
      setMouseInside(true);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('click', onClick);
    document.body.addEventListener('mouseleave', onLeave);
    document.body.addEventListener('mouseenter', onEnter);
    resetCursorTimer();

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      document.body.removeEventListener('mouseleave', onLeave);
      document.body.removeEventListener('mouseenter', onEnter);
      clearTimeout(cursorTimeoutRef.current);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, [resetCursorTimer]);

  // Countdown Update Loop
  useEffect(() => {
    if (!targetDate || !countdownActive) return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setRemainingTime('00:00:00');
        setCountdownActive(false);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setRemainingTime(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate, countdownActive]);

  // Calculate progress percentage (reversed: starts at 100%, goes down to 0%)
  const progressPercent = useMemo(() => {
    if (!countdownActive || countdownDuration <= 0 || !targetDate) return 0;

    const remainingMs = targetDate.getTime() - Date.now();

    // If limit is enabled, use limit as reference duration
    if (settings.progressBarLimitEnabled) {
      const limitMs = (settings.progressBarLimitHours * 60 * 60 + settings.progressBarLimitMinutes * 60) * 1000;

      // Bar always shows remaining time as percentage of limit duration
      // Example: 2h remaining with 3h limit = 66.6% (2/3)
      // Example: 4h remaining with 3h limit = 100% (stays full until drops below 3h)
      const percentage = Math.min(100, (remainingMs / limitMs) * 100);
      return Math.max(0, percentage);
    }

    // Normal mode: remaining time as percentage of total duration
    return Math.max(0, Math.min(100, (remainingMs / countdownDuration) * 100));
  }, [countdownActive, countdownDuration, targetDate, remainingTime, settings.progressBarLimitEnabled, settings.progressBarLimitHours, settings.progressBarLimitMinutes]);

  // Start Countdown Handler
  const handleStartCountdown = useCallback((mode: 'duration' | 'target', hours?: number, minutes?: number, targetTime?: string) => {
    let target: Date;
    const now = new Date();

    if (mode === 'duration' && hours !== undefined && minutes !== undefined) {
      const durationMs = (hours * 60 * 60 + minutes * 60) * 1000;
      target = new Date(now.getTime() + durationMs);
      setCountdownDuration(durationMs);
    } else if (mode === 'target' && targetTime) {
      const [h, m] = targetTime.split(':').map(Number);
      target = new Date();
      target.setHours(h, m, 0, 0);

      // If target time is before now, assume next day
      if (target.getTime() < now.getTime()) {
        target.setDate(target.getDate() + 1);
      }

      setCountdownDuration(target.getTime() - now.getTime());
    } else {
      return;
    }

    setTargetDate(target);
    setCountdownStartTime(now);
    setCountdownActive(true);
  }, []);

  // Reset Countdown Handler
  const handleResetCountdown = useCallback(() => {
    setTargetDate(null);
    setRemainingTime('');
    setCountdownActive(false);
    setCountdownStartTime(null);
    setCountdownDuration(0);
  }, []);

  // Toggle Settings
  const handleToggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  // Open Settings
  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  // Close Settings
  const handleCloseSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  // Confirm Close App
  const handleConfirmClose = useCallback(() => {
    window.electronAPI.closeApp();
  }, []);

  // Cancel Close App
  const handleCancelClose = useCallback(() => {
    setShowCloseConfirm(false);
  }, []);

  // Toggle Fullscreen
  const handleToggleFullscreen = useCallback(async () => {
    const isFull = await window.electronAPI.toggleFullscreen();
    setIsFullscreen(isFull);
  }, []);

  // Handle Close App
  const handleCloseApp = useCallback(() => {
    if (countdownActive) {
      setShowCloseConfirm(true);
    } else {
      window.electronAPI.closeApp();
    }
  }, [countdownActive]);

  // Get current schedule item
  const currentScheduleItemId = useMemo(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const item of settings.scheduleItems) {
      const [startH, startM] = item.startTime.split(':').map(Number);
      const [endH, endM] = item.endTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        return item.id;
      }
    }
    return null;
  }, [settings.scheduleItems, currentTime]);

  // Get current phase label from schedule
  const getCurrentPhaseLabel = useCallback(() => {
    const index = settings.currentGame - 1;
    if (index >= 0 && index < settings.scheduleItems.length) {
      return settings.scheduleItems[index].label;
    }
    return '';
  }, [settings.currentGame, settings.scheduleItems]);

  const hideControls = !showSettings && (hideCursor || !mouseInside);
  const hideAppCursor = !showSettings && hideCursor;

  return (
    <div
      className={`w-screen h-screen bg-black text-white select-none overflow-hidden flex flex-col ${
        hideAppCursor ? 'cursor-none' : ''
      }`}
    >
      <DragBar onMouseActivity={resetCursorTimer} />

      {/* Hover Controls */}
      <HoverControls
        onSettings={handleToggleSettings}
        onFullscreen={handleToggleFullscreen}
        onClose={handleCloseApp}
        visible={!hideControls}
        isFullscreen={isFullscreen}
      />

      {/* Header */}
      {settings.headerVisible && (
        <div className="flex items-center justify-center" style={{ paddingTop: `${(settings.headerHeight / 100) * 2}rem`, paddingBottom: `${(settings.headerHeight / 100) * 2}rem` }}>
          <div className="flex items-center gap-8">
            <img
              src={settings.logoPath || logo}
              alt="Logo"
              style={{ height: `calc(clamp(6rem, 15vh, 10rem) * ${settings.headerHeight / 100})`, width: 'auto' }}
            />
            <h1
              className="tracking-wide whitespace-nowrap"
              style={{
                fontSize: `calc(clamp(2.5rem, 5vw, 5rem) * ${settings.headerHeight / 100} * ${settings.headerTextSize / 100})`,
                fontWeight: settings.headerTextBold ? 700 : 400,
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)'
              }}
            >
              {settings.tournamentName}
            </h1>
          </div>
        </div>
      )}

      {/* Main Countdown Display with integrated Progress Bar */}
      <div className="flex items-center justify-center flex-1 px-3 pb-3">
        <div
          className="relative rounded-[60px] w-full h-full cursor-pointer hover:opacity-90 transition-opacity overflow-hidden border border-zinc-800"
          onClick={handleOpenSettings}
        >
          {/* Progress Bar Background (gray - darker or red when finished) */}
          <div className={`absolute inset-0 rounded-[60px] transition-colors duration-500 ${
            !countdownActive && remainingTime ? 'bg-red-600' : 'bg-gradient-to-br from-slate-600/15 to-indigo-900/15'
          }`} />

          {/* Progress Bar Foreground (green) - instant update, no animation for best performance */}
          <div
            className="absolute top-[1px] bottom-[1px] left-[1px] right-[1px] rounded-[59px]"
            style={{
              background: '#009936',
              clipPath: `inset(0 0 0 ${100 - progressPercent}% round 59px)`
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-8 h-full">
            {countdownActive && (
              <div className="absolute left-0 right-0 text-center" style={{ top: 'clamp(1rem, 3vh, 4rem)', fontSize: 'clamp(1.75rem, 4vw, 5.5rem)', textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)' }}>
                {getCurrentPhaseLabel()} endet in
              </div>
            )}
            <div className="h-full flex items-center justify-center">
              <div className="text-center w-full">
                {countdownActive ? (
                  <div
                    className="tabular-nums leading-none"
                    style={{ fontSize: 'clamp(8rem, 20vw, 22rem)', fontWeight: 400, textShadow: '2px 2px 70px rgba(0, 0, 0, 0.7)' }}
                  >
                    {remainingTime}
                  </div>
                ) : remainingTime ? (
                  <div style={{ fontSize: 'clamp(2rem, 4.5vw, 6rem)', textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)' }}>
                    {getCurrentPhaseLabel()} ist beendet
                  </div>
                ) : (
                  <div style={{ fontSize: 'clamp(2rem, 4.5vw, 6rem)', textShadow: '2px 2px 70px rgba(0, 0, 0, 0.7)' }}>
                    Countdown stellen
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule - Full Width */}
      {settings.scheduleVisible && (
        <div className="flex justify-stretch gap-3 px-3 pb-3">
          {settings.scheduleItems.map((item) => {
            const isCurrent = item.id === currentScheduleItemId;
            return (
              <div
                key={item.id}
                className={`rounded-[60px] transition-all flex-1 border border-zinc-800 ${
                  isCurrent ? 'bg-gradient-to-br from-slate-600/40 to-indigo-900/30' : 'bg-gradient-to-br from-slate-600/15 to-indigo-900/10'
                }`}
                style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: `${(settings.scheduleHeight / 100) * 2}rem`, paddingBottom: `${(settings.scheduleHeight / 100) * 2}rem` }}
              >
                <div
                  className="font-bold text-center"
                  style={{ fontSize: `calc(clamp(1.4rem, 2.2vw, 2.125rem) * ${settings.scheduleHeight / 100})`, textShadow: '2px 2px 70px rgba(0, 0, 0, 0.7)' }}
                >
                  {item.label}
                </div>
                <div
                  className="text-center mt-1"
                  style={{ fontSize: `calc(clamp(1.25rem, 2vw, 2rem) * ${settings.scheduleHeight / 100})`, textShadow: '2px 2px 70px rgba(0, 0, 0, 0.7)' }}
                >
                  {item.startTime} - {item.endTime}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        visible={showSettings}
        onClose={handleCloseSettings}
        countdownActive={countdownActive}
        onStartCountdown={handleStartCountdown}
        onResetCountdown={handleResetCountdown}
        remainingTime={remainingTime}
        countdownStartTime={countdownStartTime}
        targetDate={targetDate}
        progressBarLimitEnabled={settings.progressBarLimitEnabled}
        setProgressBarLimitEnabled={settings.setProgressBarLimitEnabled}
        progressBarLimitHours={settings.progressBarLimitHours}
        setProgressBarLimitHours={settings.setProgressBarLimitHours}
        progressBarLimitMinutes={settings.progressBarLimitMinutes}
        setProgressBarLimitMinutes={settings.setProgressBarLimitMinutes}
      />

      {/* Close Confirm Modal */}
      <ConfirmModal
        visible={showCloseConfirm}
        title="Programm beenden"
        message="Der Countdown läuft noch. Wirklich beenden?"
        confirmText="Ja"
        cancelText="Abbrechen"
        onConfirm={handleConfirmClose}
        onCancel={handleCancelClose}
      />
    </div>
  );
}
