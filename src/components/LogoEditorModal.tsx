import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';

type Props = {
  visible: boolean;
  onClose: () => void;
  imageSrc: string;
  onSave: (croppedImage: string) => void;
};

export default function LogoEditorModal({ visible, onClose, imageSrc, onSave }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number>(1); // Default to 1:1
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) return;

    const image = new Image();
    image.src = imageSrc;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      }, 'image/png');
    });
  }, [imageSrc, croppedAreaPixels]);

  const handleSave = async () => {
    const croppedImage = await createCroppedImage();
    if (croppedImage) {
      onSave(croppedImage);
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[200] bg-black/20"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className="bg-gradient-to-br from-blue-900/70 to-green-900/70 backdrop-blur-xl rounded-2xl border border-zinc-700 shadow-[0_0_70px_rgba(0,0,0,0.8)] w-[26rem] max-w-[90vw] h-[30rem] max-h-[90vh] flex flex-col overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-3 no-drag border-b border-zinc-600/40">
          <h3 className="text-white text-lg">Logo anpassen</h3>
          <button
            onClick={onClose}
            className="p-1 no-drag text-white/80 hover:text-white focus:outline-none transform transition-transform duration-200 ease-out hover:scale-130 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Crop Area */}
        <div
          className="flex-1 relative bg-zinc-900/75"
          onWheel={(e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.125 : 0.125;
            const newZoom = Math.min(3, Math.max(1, zoom + delta));
            setZoom(newZoom);
          }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            zoomWithScroll={false}
          />
        </div>

        {/* Controls */}
        <div className="px-6 py-4 bg-zinc-900/75 space-y-3">
          {/* Aspect Ratio Buttons */}
          <div className="flex items-center gap-3">
            <span className="text-base text-white">Seitenverhältnis:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setAspect(1)}
                className={`px-3 py-1 rounded-full border text-sm transition-all ${
                  aspect === 1
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-500 border-blue-500 text-white'
                    : 'bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 border-zinc-600/50 text-white/80 hover:text-white hover:from-zinc-700/70 hover:to-zinc-600/70'
                } focus:outline-none`}
              >
                1:1
              </button>
              <button
                onClick={() => setAspect(16/9)}
                className={`px-3 py-1 rounded-full border text-sm transition-all ${
                  aspect === 16/9
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-500 border-blue-500 text-white'
                    : 'bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 border-zinc-600/50 text-white/80 hover:text-white hover:from-zinc-700/70 hover:to-zinc-600/70'
                } focus:outline-none`}
              >
                16:9
              </button>
              <button
                onClick={() => setAspect(4/3)}
                className={`px-3 py-1 rounded-full border text-sm transition-all ${
                  aspect === 4/3
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-500 border-blue-500 text-white'
                    : 'bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 border-zinc-600/50 text-white/80 hover:text-white hover:from-zinc-700/70 hover:to-zinc-600/70'
                } focus:outline-none`}
              >
                4:3
              </button>
            </div>
          </div>

          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <label className="w-20 shrink-0">Zoom:</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => {
                const val = Number(e.target.value);
                setZoom(val);
                (e.target as HTMLInputElement).style.setProperty('--val', `${((val - 1) / (3 - 1)) * 100}%`);
              }}
              className="flex-1 height-range"
              style={{
                ['--val' as any]: `${((zoom - 1) / (3 - 1)) * 100}%`,
              }}
              onInput={(e) => {
                const val = Number((e.target as HTMLInputElement).value);
                const percentage = ((val - 1) / (3 - 1)) * 100;
                (e.target as HTMLInputElement).style.setProperty('--val', `${percentage}%`);
              }}
            />
            <span className="w-12 text-right shrink-0">{zoom.toFixed(3).replace('.', ',')}x</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 relative flex justify-center gap-3 no-drag bg-zinc-900/75 rounded-b-2xl">
          <div className="absolute top-0 left-4 right-4 border-t-2 border-zinc-600/40"></div>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-gradient-to-br from-zinc-700 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500 border border-zinc-500/30 text-white rounded-xl transition-all"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2.5 bg-gradient-to-br from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 border border-green-500/30 text-white rounded-xl transition-all"
          >
            Übernehmen
          </button>
        </div>
      </div>
    </div>
  );
}
