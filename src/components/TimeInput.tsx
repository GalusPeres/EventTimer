import React, { useState, useRef, useEffect } from 'react';

type TimeInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function TimeInput({ value, onChange, className = '' }: TimeInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse value when it changes
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      setSelectedHour(h || '09');
      setSelectedMinute(m || '00');
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = ['00', '15', '30', '45']; // Nur 15-Minuten-Schritte

  const handleHourClick = (hour: string) => {
    setSelectedHour(hour);
    onChange(`${hour}:${selectedMinute}`);
    setIsOpen(false);
  };

  const handleMinuteClick = (minute: string) => {
    setSelectedMinute(minute);
    onChange(`${selectedHour}:${minute}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Input Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-2 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 flex items-center justify-between ${className}`}
      >
        <span>{value || '00:00'}</span>
        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth="2"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7v5l3 3"/>
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-zinc-800 border border-zinc-600 rounded-lg shadow-xl z-50 p-2 grid grid-cols-2 gap-2">
          {/* Hours */}
          <div>
            <div className="text-xs text-white/60 mb-1 px-2">Stunde</div>
            <div className="grid grid-cols-4 gap-1">
              {hours.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  onClick={() => handleHourClick(hour)}
                  className={`px-2 py-1.5 text-xs rounded transition-colors ${
                    selectedHour === hour
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-700 text-white/80 hover:bg-zinc-600'
                  }`}
                >
                  {hour}
                </button>
              ))}
            </div>
          </div>

          {/* Minutes */}
          <div>
            <div className="text-xs text-white/60 mb-1 px-2">Minute</div>
            <div className="grid grid-cols-2 gap-1">
              {minutes.map((minute) => (
                <button
                  key={minute}
                  type="button"
                  onClick={() => handleMinuteClick(minute)}
                  className={`px-2 py-1.5 text-xs rounded transition-colors ${
                    selectedMinute === minute
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-700 text-white/80 hover:bg-zinc-600'
                  }`}
                >
                  {minute}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
