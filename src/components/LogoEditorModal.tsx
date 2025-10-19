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
      className="fixed inset-0 flex items-center justify-center z-[200]"
      onClick={onClose}
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className="bg-gradient-to-br from-blue-900/70 to-green-900/70 backdrop-blur-xl rounded-2xl border border-zinc-700 shadow-[0_0_70px_rgba(0,0,0,0.8)] w-[40rem] max-w-[90vw] h-[32rem] max-h-[90vh] flex flex-col overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-3 no-drag">
          <h3 className="text-white text-lg">Logo anpassen</h3>
          <button
            onClick={onClose}
            className="p-1 no-drag text-white/80 hover:text-white focus:outline-none transform transition-transform duration-200 ease-out hover:scale-130 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Crop Area */}
        <div className="flex-1 relative bg-zinc-900/75">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom Slider */}
        <div className="px-6 py-4 bg-zinc-900/75">
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/90">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
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
            <span className="text-sm text-white/90 w-12">{zoom.toFixed(1)}x</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 relative flex justify-center gap-3 no-drag bg-zinc-900/75">
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
