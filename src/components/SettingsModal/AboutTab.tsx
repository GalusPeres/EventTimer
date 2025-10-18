import React from 'react';

export default function AboutTab() {
  return (
    <div className="space-y-4">
      {/* App Info */}
      <div className="p-3 bg-zinc-800/50 border border-zinc-700/30 rounded-md space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-white/60">Version</span>
          <span className="text-xs">1.0.0</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-white/60">Entwickelt für</span>
          <span className="text-xs">Warhammer Turniere</span>
        </div>
      </div>

      {/* Description */}
      <div className="p-3 bg-zinc-800/50 border border-zinc-700/30 rounded-md">
        <p className="text-xs text-white/80 leading-relaxed">
          Diese Anwendung zeigt einen großen Countdown-Timer mit Zeitplan-Übersicht für Tournament-Events.
          Der Timer unterstützt zwei Modi: Countdown nach Dauer oder bis zu einer bestimmten Uhrzeit.
        </p>
      </div>

      {/* Features */}
      <div className="p-3 bg-zinc-800/50 border border-zinc-700/30 rounded-md">
        <h4 className="text-xs mb-2">Features</h4>
        <ul className="space-y-1.5 text-xs text-white/80">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Dualer Countdown-Modus (Dauer / Zielzeit)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>3 konfigurierbare Spiele</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Anpassbarer Zeitplan mit 5 Einträgen</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Visueller Fortschrittsbalken</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Vollbildmodus</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Automatisches Speichern aller Einstellungen</span>
          </li>
        </ul>
      </div>

      {/* Tech Stack */}
      <div className="p-3 bg-zinc-800/50 border border-zinc-700/30 rounded-md">
        <h4 className="text-xs mb-2">Technologie</h4>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-zinc-700/50 rounded-full text-xs">Electron 28</span>
          <span className="px-2 py-1 bg-zinc-700/50 rounded-full text-xs">React 18</span>
          <span className="px-2 py-1 bg-zinc-700/50 rounded-full text-xs">TypeScript 5</span>
          <span className="px-2 py-1 bg-zinc-700/50 rounded-full text-xs">Tailwind CSS</span>
          <span className="px-2 py-1 bg-zinc-700/50 rounded-full text-xs">Vite</span>
        </div>
      </div>
    </div>
  );
}
