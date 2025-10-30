// Dropdown with manual input option
import React, { useState, useEffect, useRef } from 'react';

export type NumberSelectOption = { value: number; label: string };

export function NumberSelect({
  options,
  value,
  onChange,
  min,
  max,
}: {
  options: NumberSelectOption[];
  value: number;
  onChange(val: number): void;
  min?: number;
  max?: number;
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener('mousedown', onClickOutside);
    return () => window.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Scroll to selected item when opening (only once)
  useEffect(() => {
    if (open && listRef.current) {
      const selectedIndex = options.findIndex((o) => o.value === value);
      if (selectedIndex >= 0) {
        const listElement = listRef.current;
        setTimeout(() => {
          const itemHeight = listElement.scrollHeight / options.length;
          const scrollPosition = Math.max(0, (selectedIndex * itemHeight) - (listElement.clientHeight / 2) + (itemHeight / 2));
          listElement.scrollTop = scrollPosition;
        }, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const num = parseInt(val);
    if (!isNaN(num)) {
      let clampedNum = num;
      if (min !== undefined && num < min) clampedNum = min;
      if (max !== undefined && num > max) clampedNum = max;
      onChange(clampedNum);
    }
  };

  const handleBlur = () => {
    // Ensure valid number on blur
    const num = parseInt(inputValue);
    if (isNaN(num)) {
      setInputValue(String(value));
    }
  };

  return (
    <div ref={ref} className="relative w-full">
      <style>
        {`
          .custom-scroll::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: #27272a;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background-color: #52525b;
            border-radius: 3px;
          }
        `}
      </style>

      <div className="w-full bg-zinc-900/60 border border-zinc-700 text-white text-sm rounded-lg flex items-center focus-within:border-blue-500">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="flex-1 bg-transparent px-2 py-2 focus:outline-none min-w-0"
          placeholder="Größe"
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="px-1 py-1 focus:outline-none hover:bg-zinc-700/50 rounded shrink-0"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 8l5 5 5-5H5z" />
          </svg>
        </button>
      </div>

      {open && (
        <ul
          ref={listRef}
          className="
            absolute z-[100] mt-1 right-0 w-16 bg-zinc-900 border border-zinc-700
            rounded-lg max-h-48 overflow-auto text-sm leading-tight
            custom-scroll
          "
        >
          {options.map((o) => (
            <li
              key={o.value}
              onMouseDown={(e) => {
                e.preventDefault();
                setOpen(false);
                onChange(o.value);
              }}
              title={o.label}
              className={`
                px-3 py-1 cursor-pointer transition-colors
                ${o.value === value
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white'
                  : 'text-zinc-200 hover:bg-zinc-700 hover:text-white'}
              `}
            >
              <span className="block truncate">{o.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
