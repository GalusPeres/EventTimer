import React, { useState, useEffect } from 'react';
import { useSettings, ScheduleItem } from '../../context/SettingsContext';

type Props = {
  onFooterRender?: (footer: React.ReactNode) => void;
};

export default function ScheduleTab({ onFooterRender }: Props) {
  const settings = useSettings();
  const [editingItems, setEditingItems] = useState<ScheduleItem[]>(settings.scheduleItems);
  const [originalItems, setOriginalItems] = useState<ScheduleItem[]>(settings.scheduleItems);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize once on mount
  useEffect(() => {
    if (!isInitialized) {
      setEditingItems(settings.scheduleItems);
      setOriginalItems(settings.scheduleItems);
      setIsInitialized(true);
    }
  }, [isInitialized, settings.scheduleItems]);

  // Check for changes
  const hasChanges = JSON.stringify(editingItems) !== JSON.stringify(originalItems);

  const updateItem = (index: number, field: keyof ScheduleItem, value: string) => {
    const newItems = [...editingItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditingItems(newItems);
  };

  const addItem = () => {
    const newItem: ScheduleItem = {
      id: `item-${Date.now()}`,
      label: 'Neuer Eintrag',
      startTime: '00:00',
      endTime: '00:00',
    };
    const newItems = [...editingItems, newItem];
    setEditingItems(newItems);
  };

  const deleteItem = (index: number) => {
    const newItems = editingItems.filter((_, i) => i !== index);
    setEditingItems(newItems);
  };

  const handleSave = () => {
    settings.setScheduleItems(editingItems);
    setOriginalItems(editingItems);
  };

  const handleUndo = () => {
    setEditingItems(originalItems);
  };

  const handleReset = () => {
    const defaultItems = [
      { id: 'item-1', label: 'SPIEL 1', startTime: '09:30', endTime: '12:45' },
      { id: 'item-2', label: 'MITTAGSPAUSE', startTime: '12:45', endTime: '13:45' },
      { id: 'item-3', label: 'SPIEL 2', startTime: '13:45', endTime: '17:00' },
      { id: 'item-4', label: 'SPIEL 3', startTime: '17:05', endTime: '20:20' },
      { id: 'item-5', label: 'SIEGEREHRUNG', startTime: '20:30', endTime: '23:59' },
    ];
    setEditingItems(defaultItems);
    setOriginalItems(defaultItems);
    settings.setScheduleItems(defaultItems);
  };

  // Save changes when leaving the tab or closing modal
  useEffect(() => {
    return () => {
      // Save on unmount if there are changes
      if (hasChanges) {
        settings.setScheduleItems(editingItems);
      }
    };
  }, [editingItems, hasChanges, settings]);

  // Render footer buttons
  useEffect(() => {
    if (onFooterRender) {
      onFooterRender(
        <>
          <button
            onClick={addItem}
            className="px-6 py-2 bg-gradient-to-br from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 border border-green-500/30 text-white rounded-xl transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Hinzufügen
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gradient-to-br from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 border border-blue-500/30 text-white rounded-xl transition-all"
          >
            Reset
          </button>
        </>
      );
    }
  }, [onFooterRender]);

  return (
    <div className="space-y-4">
      {/* Schedule Visibility Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => settings.setScheduleVisible(!settings.scheduleVisible)}
          className={`
            w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all
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

      {/* Zeitplan Items */}
      <div>
        <div className="mb-2 text-base text-white">Zeitplan-Einträge:</div>

        {/* Table Header */}
        <div className="grid grid-cols-[1fr,7rem,7rem,2.5rem] gap-2 px-2 text-xs text-white/60 mb-2">
          <div>Bezeichnung</div>
          <div className="text-center">Von</div>
          <div className="text-center">Bis</div>
          <div></div>
        </div>

      {/* Schedule Items Table */}
      <div className="space-y-2">
        {editingItems.map((item, index) => (
          <div key={item.id} className="grid grid-cols-[1fr,7rem,7rem,2.5rem] gap-2 items-center">
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
