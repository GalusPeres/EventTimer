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
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  // Parse value when it changes
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      setSelectedHour(h || '09');
      setSelectedMinute(m || '00');
    }
  }, [value]);

  // Scroll to selected items when opening
  useEffect(() => {
    if (isOpen && hourScrollRef.current && minuteScrollRef.current) {
      // Scroll hour
      const hourIndex = parseInt(selectedHour);
      const hourElement = hourScrollRef.current.children[hourIndex] as HTMLElement;
      if (hourElement) {
        hourScrollRef.current.scrollTop = hourElement.offsetTop - hourScrollRef.current.offsetTop - 60;
      }

      // Scroll minute
      const minuteIndex = parseInt(selectedMinute);
      const minuteElement = minuteScrollRef.current.children[minuteIndex] as HTMLElement;
      if (minuteElement) {
        minuteScrollRef.current.scrollTop = minuteElement.offsetTop - minuteScrollRef.current.offsetTop - 60;
      }
    }
  }, [isOpen, selectedHour, selectedMinute]);

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
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const handleHourClick = (hour: string) => {
    setSelectedHour(hour);
    onChange(`${hour}:${selectedMinute}`);
  };

  const handleMinuteClick = (minute: string) => {
    setSelectedMinute(minute);
    onChange(`${selectedHour}:${minute}`);
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

      {/* Dropdown - Scrollable Columns */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-zinc-800 border border-zinc-600 rounded-lg shadow-xl z-50 flex">
          {/* Hours Column */}
          <div className="flex flex-col border-r border-zinc-600">
            <div
              ref={hourScrollRef}
              className="overflow-y-auto h-40 scrollbar-hide"
            >
              {hours.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  onClick={() => handleHourClick(hour)}
                  className={`w-full px-4 py-2 text-sm transition-colors ${
                    selectedHour === hour
                      ? 'bg-blue-600 text-white'
                      : 'text-white/80 hover:bg-zinc-700'
                  }`}
                >
                  {hour}
                </button>
              ))}
            </div>
          </div>

          {/* Minutes Column */}
          <div className="flex flex-col">
            <div
              ref={minuteScrollRef}
              className="overflow-y-auto h-40 scrollbar-hide"
            >
              {minutes.map((minute) => (
                <button
                  key={minute}
                  type="button"
                  onClick={() => handleMinuteClick(minute)}
                  className={`w-full px-4 py-2 text-sm transition-colors ${
                    selectedMinute === minute
                      ? 'bg-blue-600 text-white'
                      : 'text-white/80 hover:bg-zinc-700'
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
