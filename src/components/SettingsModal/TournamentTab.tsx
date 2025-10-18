import React, { useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';
import defaultLogo from '../../assets/logo.png';

export default function TournamentTab() {
  const settings = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert file to data URL for preview and storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        settings.setLogoPath(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentLogo = settings.logoPath || defaultLogo;

  // Logo Storage: The logo is stored as a Base64 Data URL in localStorage
  // This works cross-platform (Windows/Mac) because it's saved in the browser's localStorage
  // No file system dependencies needed

  return (
    <div className="space-y-6">
      {/* Header Visibility Toggle */}
      <div className="grid grid-cols-2 gap-3 items-center">
        {/* Column 1: Checkbox + Label */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => settings.setHeaderVisible(!settings.headerVisible)}
            className={`
              w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all shrink-0
              ${settings.headerVisible
                ? 'bg-gradient-to-br from-blue-600 to-indigo-500 border-blue-500'
                : 'bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 border-zinc-600/50 hover:from-zinc-700/70 hover:to-zinc-600/70 hover:border-zinc-500/70'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500/50
            `}
          >
            {settings.headerVisible && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <span
            onClick={() => settings.setHeaderVisible(!settings.headerVisible)}
            className="text-sm text-white/90 cursor-pointer select-none"
          >
            Kopf anzeigen
          </span>
        </div>

        {/* Column 2: Height Slider - nur wenn Header sichtbar */}
        {settings.headerVisible && (
          <div className="flex items-center justify-end">
            <span className="text-sm text-white/90 mr-2.5">Größe</span>
            <input
              type="range"
              min={50}
              max={150}
              step={5}
              value={settings.headerHeight}
              onChange={(e) => {
                const value = Number(e.target.value);
                settings.setHeaderHeight(value);
              }}
              className="w-32 height-range"
              style={{
                ['--val' as any]: `${((settings.headerHeight - 50) / (150 - 50)) * 100}%`,
              }}
              onInput={(e) => {
                const val = Number((e.target as HTMLInputElement).value);
                const percentage = ((val - 50) / (150 - 50)) * 100;
                (e.target as HTMLInputElement).style.setProperty('--val', `${percentage}%`);
              }}
            />
            <span className="text-sm text-white/90 w-10 shrink-0 text-right ml-1.5">{settings.headerHeight}%</span>
          </div>
        )}
      </div>

      {/* Tournament Name Editor */}
      <div>
        <div className="mb-2 text-base text-white">Überschrift:</div>
        <input
          type="text"
          value={settings.tournamentName}
          onChange={(e) => settings.setTournamentName(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          placeholder="Überschrift eingeben"
        />
      </div>

      {/* Logo Upload */}
      <div>
        <div className="mb-2 text-base text-white">Logo:</div>

        <div className="flex flex-col items-center gap-3">
          {/* Logo Preview */}
          <div className="relative w-32 h-32 bg-zinc-900 border-2 border-zinc-700 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={currentLogo}
              alt="Logo Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={handleLogoClick}
            className="px-4 py-2 bg-gradient-to-br from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 border border-green-500/30 text-white rounded-lg transition-all text-sm"
          >
            Logo auswählen
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
