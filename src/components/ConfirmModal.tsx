import React from 'react';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmText = 'Bestätigen',
  cancelText = 'Abbrechen',
  onConfirm,
  onCancel,
}: Props) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[200]"
      onClick={onCancel}
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className="
          bg-gradient-to-br from-blue-900/90 to-green-900/90
          backdrop-blur-xl
          rounded-2xl
          border border-zinc-700
          shadow-[0_0_70px_rgba(0,0,0,0.8)]
          w-[24rem] max-w-[90vw]
          flex flex-col
          animate-fade-in
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-600/40">
          <h3 className="text-white text-lg">{title}</h3>
        </div>

        {/* Content */}
        <div className="px-6 py-6 text-white/90">
          {message}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-3 border-t border-zinc-600/40">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl text-sm transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border border-red-500/30 text-white rounded-xl text-sm transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
