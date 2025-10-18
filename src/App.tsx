import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSettings } from './context/SettingsContext';
import SettingsModal from './components/SettingsModal/SettingsModal';
import DragBar from './components/DragBar';
import HoverControls from './components/HoverControls';
import logo from './assets/logo.png';

declare global {
  interface Window {
    electronAPI: {
      toggleFullscreen: () => Promise<boolean>;
      isFullscreen: () => Promise<boolean>;
      closeApp: () => void;
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
  const [progressBarLimitEnabled, setProgressBarLimitEnabled] = useState<boolean>(false);
  const [progressBarLimitHours, setProgressBarLimitHours] = useState<number>(3);
  const [progressBarLimitMinutes, setProgressBarLimitMinutes] = useState<number>(0);

  // UI State
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hideCursor, setHideCursor] = useState(false);
  const [mouseInside, setMouseInside] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');

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

  // Fullscreen detection
  useEffect(() => {
    const checkFullscreen = async () => {
      const isFull = await window.electronAPI.isFullscreen();
      setIsFullscreen(isFull);
    };
    checkFullscreen();
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
    const onMove = resetCursorTimer;
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
  const progressPercent = countdownActive && countdownDuration > 0 && targetDate
    ? (() => {
        const remainingMs = targetDate.getTime() - Date.now();

        // If limit is enabled, use limit as reference duration
        if (progressBarLimitEnabled) {
          const limitMs = (progressBarLimitHours * 60 * 60 + progressBarLimitMinutes * 60) * 1000;

          // Bar always shows remaining time as percentage of limit duration
          // Example: 2h remaining with 3h limit = 66.6% (2/3)
          // Example: 4h remaining with 3h limit = 100% (stays full until drops below 3h)
          const percentage = Math.min(100, (remainingMs / limitMs) * 100);
          return Math.max(0, percentage);
        }

        // Normal mode: remaining time as percentage of total duration
        return Math.max(0, Math.min(100, (remainingMs / countdownDuration) * 100));
      })()
    : 0;

  // Start Countdown Handler
  const handleStartCountdown = (mode: 'duration' | 'target', hours?: number, minutes?: number, targetTime?: string) => {
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
  };

  // Reset Countdown Handler
  const handleResetCountdown = () => {
    setTargetDate(null);
    setRemainingTime('');
    setCountdownActive(false);
    setCountdownStartTime(null);
    setCountdownDuration(0);
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = async () => {
    const isFull = await window.electronAPI.toggleFullscreen();
    setIsFullscreen(isFull);
  };

  // Get current schedule item
  const getCurrentScheduleItem = () => {
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
  };

  const currentScheduleItemId = getCurrentScheduleItem();

  // Get current phase label from schedule
  const getCurrentPhaseLabel = () => {
    const index = settings.currentGame - 1;
    if (index >= 0 && index < settings.scheduleItems.length) {
      return settings.scheduleItems[index].label;
    }
    return '';
  };

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
        onSettings={() => setShowSettings(true)}
        onFullscreen={handleToggleFullscreen}
        onClose={() => window.electronAPI.closeApp()}
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
              className="font-bold tracking-wide whitespace-nowrap"
              style={{ fontSize: `calc(clamp(2.5rem, 5vw, 5rem) * ${settings.headerHeight / 100})`, textShadow: '2px 2px 70px rgba(0, 0, 0, 0.7)' }}
            >
              {settings.tournamentName}
            </h1>
          </div>
        </div>
      )}

      {/* Main Countdown Display with integrated Progress Bar */}
      <div className="flex items-center justify-center flex-1 px-3 pb-3">
        <div
          className="relative rounded-[70px] w-full h-full cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
          onClick={() => setShowSettings(true)}
        >
          {/* Progress Bar Background (gray - #11131b) */}
          <div className="absolute inset-0 bg-[#11131b] rounded-[70px]" />

          {/* Progress Bar Foreground (green) - clips from left to right (right side shrinks) */}
          <div
            className="absolute inset-0 bg-green-600 transition-all duration-1000 ease-linear rounded-[70px]"
            style={{
              clipPath: `inset(0 0 0 ${100 - progressPercent}% round 70px)`
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-8 h-full">
            {countdownActive && (
              <div className="absolute left-0 right-0 text-center" style={{ top: 'clamp(1rem, 3vh, 4rem)', fontSize: 'clamp(2rem, 4.5vw, 6rem)', textShadow: '2px 2px 70px rgba(0, 0, 0, 0.7)' }}>
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
                  <div style={{ fontSize: 'clamp(2rem, 4vw, 5rem)', fontWeight: 'bold', textShadow: '2px 2px 70px rgba(0, 0, 0, 0.7)' }}>
                    {getCurrentPhaseLabel()} ist beendet
                  </div>
                ) : (
                  <div style={{ fontSize: 'clamp(2rem, 4vw, 5rem)', fontWeight: 'bold', textShadow: '2px 2px 70px rgba(0, 0, 0, 0.7)' }}>
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
                className={`bg-[#11131b] rounded-[50px] transition-all flex-1 ${
                  isCurrent ? 'bg-opacity-100' : 'bg-opacity-60'
                }`}
                style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: `${(settings.scheduleHeight / 100) * 2}rem`, paddingBottom: `${(settings.scheduleHeight / 100) * 2}rem` }}
              >
                <div
                  className="font-bold text-center"
                  style={{ fontSize: `calc(clamp(1.2rem, 2vw, 1.875rem) * ${settings.scheduleHeight / 100})`, textShadow: '2px 2px 70px rgba(0, 0, 0, 0.7)' }}
                >
                  {item.label}
                </div>
                <div
                  className="text-center mt-1"
                  style={{ fontSize: `calc(clamp(1.125rem, 1.75vw, 1.75rem) * ${settings.scheduleHeight / 100})`, textShadow: '2px 2px 70px rgba(0, 0, 0, 0.7)' }}
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
        onClose={() => setShowSettings(false)}
        countdownActive={countdownActive}
        onStartCountdown={handleStartCountdown}
        onResetCountdown={handleResetCountdown}
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
    </div>
  );
}
