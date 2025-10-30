// src/components/DragBar.tsx - Draggable window area for frameless window
import React from 'react';

type Props = {
  onMouseActivity?: () => void;
};

const DragBar = React.memo(function DragBar({ onMouseActivity }: Props) {
  return (
    <div
      style={{ WebkitAppRegion: 'drag' } as any}
      className="absolute top-0 left-0 w-full h-8 bg-transparent z-40"
    />
  );
});

export default DragBar;
