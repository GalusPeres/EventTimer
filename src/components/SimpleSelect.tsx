// src/components/SimpleSelect.tsx - Custom dropdown select component
import React, { useState, useEffect, useRef } from 'react';

export type SimpleSelectOption = { value: string; label: string };

export function SimpleSelect({
  options,
  value,
  onChange,
}: {
  options: SimpleSelectOption[];
  value: string;
  onChange(val: string): void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

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
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
          const itemHeight = listElement.scrollHeight / options.length;
          const scrollPosition = Math.max(0, (selectedIndex * itemHeight) - (listElement.clientHeight / 2) + (itemHeight / 2));
          listElement.scrollTop = scrollPosition;
        }, 0);
      }
    }
    // Only run when 'open' changes, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const selected = options.find((o) => o.value === value);

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

      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-zinc-900/60 border border-zinc-700 text-white text-sm p-2 rounded-lg flex justify-between items-center focus:outline-none"
      >
        <span className="block truncate">{selected?.label || 'Select…'}</span>
        <svg className="w-4 h-4 ml-2 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 8l5 5 5-5H5z" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          className="
            absolute z-10 mt-1 w-full bg-zinc-900 border border-zinc-700
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
