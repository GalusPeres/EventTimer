// src/components/HudButton.tsx
// Reusable HUD button with blur style, hover scale, tooltip delay and disabled state.

import React, { useRef, useState } from 'react';
import { HudTooltip } from './HudTooltip';

type Variant = 'gray' | 'red' | 'gray-to-red';

export type HudButtonProps = {
  children: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
  positionClass: string;
  style?: React.CSSProperties;
  visible: boolean;
  variant?: Variant;
  tooltipPlacement?: 'top' | 'bottom';
  tooltipDelayMs?: number;
};

export default function HudButton({
  children,
  tooltip,
  onClick,
  positionClass,
  style,
  visible,
  variant = 'gray',
  tooltipPlacement = 'top',
  tooltipDelayMs = 700,
}: HudButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [tipVisible, setTipVisible] = useState(false);
  const delayRef = useRef<number>();

  const onEnter = () => {
    clearTimeout(delayRef.current);
    delayRef.current = window.setTimeout(() => setTipVisible(true), tooltipDelayMs);
    setHover(true);
  };

  const onLeave = () => {
    clearTimeout(delayRef.current);
    setTipVisible(false);
    setHover(false);
  };

  const baseHud = `
    w-12 h-12 rounded-full flex items-center justify-center
    backdrop-filter backdrop-blur-[6px]
    transition-transform duration-200 ease-out
    group cursor-pointer z-[100]
  `;

  const variantClass: Record<Variant, string> = {
    gray: 'bg-zinc-800/50 hover:bg-zinc-800/60 border border-zinc-700/30',
    red: 'bg-red-600/70 hover:bg-red-600/80 border border-red-500/30',
    'gray-to-red': 'bg-zinc-800/50 hover:bg-red-600/70 border border-zinc-700/30 hover:border-red-500/30',
  };

  return (
    <>
      <div
        ref={containerRef}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
        className={`${positionClass} ${baseHud} hover:scale-110 ${variantClass[variant]}`}
        style={{
          ...(style || {}),
          pointerEvents: visible ? 'auto' : 'none',
          WebkitAppRegion: 'no-drag',
        } as React.CSSProperties}
      >
        {children}
      </div>

      <HudTooltip
        visible={tipVisible && hover && visible}
        targetRef={containerRef}
        placement={tooltipPlacement}
      >
        {tooltip}
      </HudTooltip>
    </>
  );
}
