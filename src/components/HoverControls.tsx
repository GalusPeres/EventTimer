import React from 'react';
import HudButton from './HudButton';
import settingsIcon from '../assets/icons/settings.svg';
import fullscreenIcon from '../assets/icons/fullscreen.svg';
import closeIcon from '../assets/icons/close.svg';

type Props = {
  onSettings(): void;
  onFullscreen(): void;
  onClose(): void;
  visible: boolean;
  isFullscreen: boolean;
};

const HoverControls = React.memo(function HoverControls({
  onSettings,
  onFullscreen,
  onClose,
  visible,
  isFullscreen,
}: Props) {
  const animClass = visible ? 'animate-slide-up-fast' : 'animate-slide-down-fast';

  const STEP = 52;
  const rightPx = (i: number) => 36 + (STEP * i); // Equal spacing from edge
  const topPosition = '40px'; // Below the drag bar (32px + 8px gap)

  return (
    <>
      {/* Close */}
      <HudButton
        tooltip="Schließen"
        onClick={onClose}
        positionClass={`absolute ${animClass}`}
        style={{ right: rightPx(0), top: topPosition }}
        visible={visible}
        variant="gray-to-red"
      >
        <img src={closeIcon} className="w-6 h-6 transition-all duration-150 ease-out group-hover:scale-125" />
      </HudButton>

      {/* Fullscreen */}
      <HudButton
        tooltip={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        onClick={onFullscreen}
        positionClass={`absolute ${animClass}`}
        style={{ right: rightPx(1), top: topPosition }}
        visible={visible}
        variant="gray"
      >
        <img src={fullscreenIcon} className="w-6 h-6 transition-all duration-150 ease-out group-hover:scale-125" />
      </HudButton>

      {/* Settings */}
      <HudButton
        tooltip="Einstellungen"
        onClick={onSettings}
        positionClass={`absolute ${animClass}`}
        style={{ right: rightPx(2), top: topPosition }}
        visible={visible}
        variant="gray"
      >
        <img src={settingsIcon} className="w-6 h-6 transition-all duration-150 ease-out group-hover:scale-125" />
      </HudButton>
    </>
  );
});

export default HoverControls;
