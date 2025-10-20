import React, { useEffect } from 'react';
import { useSettings, ScheduleItem } from '../../context/SettingsContext';

type Props = {
  onFooterRender?: (footer: React.ReactNode) => void;
};

export default function ScheduleTab({ onFooterRender }: Props) {
  const settings = useSettings();

  const updateItem = (index: number, field: keyof ScheduleItem, value: string) => {
    const newItems = [...settings.scheduleItems];
    newItems[index] = { ...newItems[index], [field]: value };
    settings.setScheduleItems(newItems);
  };

  const addItem = () => {
    const newItem: ScheduleItem = {
      id: `item-${Date.now()}`,
      label: 'Neuer Eintrag',
      startTime: '00:00',
      endTime: '00:00',
    };
    const newItems = [...settings.scheduleItems, newItem];
    settings.setScheduleItems(newItems);
  };

  const deleteItem = (index: number) => {
    const newItems = settings.scheduleItems.filter((_, i) => i !== index);
    settings.setScheduleItems(newItems);
  };

  // Render footer button (only Add button, Reset is in SettingsModal)
  useEffect(() => {
    if (onFooterRender) {
      onFooterRender(
        <button
          onClick={addItem}
          className="px-4 py-2.5 bg-gradient-to-br from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 border border-green-500/30 text-white rounded-xl transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Hinzufügen
        </button>
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      {/* Schedule Visibility Toggle */}
      <div className="grid grid-cols-2 gap-3 items-center">
        {/* Column 1: Checkbox + Label */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => settings.setScheduleVisible(!settings.scheduleVisible)}
            className={`
              w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all shrink-0
              ${settings.scheduleVisible
                ? 'bg-gradient-to-br from-blue-600 to-indigo-500 border-blue-500'
                : 'bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 border-zinc-600/50 hover:from-zinc-700/70 hover:to-zinc-600/70 hover:border-zinc-500/70'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500/50
            `}
          >
            {settings.scheduleVisible && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <span
            onClick={() => settings.setScheduleVisible(!settings.scheduleVisible)}
            className="text-sm text-white/90 cursor-pointer select-none"
          >
            Zeitplan anzeigen
          </span>
        </div>

        {/* Column 2: Height Slider - nur wenn Schedule sichtbar */}
        {settings.scheduleVisible && (
          <div className="flex items-center justify-end">
            <span className="text-sm text-white/90 mr-2.5">Größe</span>
            <input
              type="range"
              min={50}
              max={150}
              step={5}
              value={settings.scheduleHeight}
              onChange={(e) => {
                const value = Number(e.target.value);
                settings.setScheduleHeight(value);
              }}
              className="w-32 height-range"
              style={{
                ['--val' as any]: `${((settings.scheduleHeight - 50) / (150 - 50)) * 100}%`,
              }}
              onInput={(e) => {
                const val = Number((e.target as HTMLInputElement).value);
                const percentage = ((val - 50) / (150 - 50)) * 100;
                (e.target as HTMLInputElement).style.setProperty('--val', `${percentage}%`);
              }}
            />
            <span className="text-sm text-white/90 w-10 shrink-0 text-right ml-1.5">{settings.scheduleHeight}%</span>
          </div>
        )}
      </div>

      {/* Zeitplan Items */}
      <div>
        <div className="mb-2 text-base text-white">Zeitplan-Einträge:</div>

        {/* Table Header */}
        <div className="grid grid-cols-[1fr,6rem,6rem,2.5rem] gap-2 px-2 text-xs text-white/60 mb-2">
          <div>Bezeichnung</div>
          <div className="text-center">Von</div>
          <div className="text-center">Bis</div>
          <div></div>
        </div>

      {/* Schedule Items Table */}
      <div className="space-y-2">
        {settings.scheduleItems.map((item, index) => (
          <div key={item.id} className="grid grid-cols-[1fr,6rem,6rem,2.5rem] gap-2 items-center">
            <input
              type="text"
              value={item.label}
              onChange={(e) => updateItem(index, 'label', e.target.value)}
              className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="Bezeichnung"
            />
            <input
              type="time"
              value={item.startTime}
              onChange={(e) => updateItem(index, 'startTime', e.target.value)}
              className="px-2 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              style={{ colorScheme: 'dark' }}
            />
            <input
              type="time"
              value={item.endTime}
              onChange={(e) => updateItem(index, 'endTime', e.target.value)}
              className="px-2 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              style={{ colorScheme: 'dark' }}
            />
            <button
              onClick={() => deleteItem(index)}
              className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
              title="Löschen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
