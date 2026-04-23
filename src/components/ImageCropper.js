'use client';
import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, ZoomOut, Check } from 'lucide-react';

// Fonction pour créer l'image recadrée
const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => { image.onload = resolve; });

  const canvas = document.createElement('canvas');
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    croppedAreaPixels.x, croppedAreaPixels.y,
    croppedAreaPixels.width, croppedAreaPixels.height,
    0, 0,
    croppedAreaPixels.width, croppedAreaPixels.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
  });
};

export default function ImageCropper({ image, aspect = 1, onCropComplete, onCancel, titre = 'Recadrer la photo' }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteHandler = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const valider = async () => {
    const blob = await getCroppedImg(image, croppedAreaPixels);
    onCropComplete(blob);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
        <button onClick={onCancel} className="text-white hover:text-gray-300 transition">
          <X size={24} />
        </button>
        <h3 className="text-white font-medium">{titre}</h3>
        <button onClick={valider}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
          <Check size={16} />
          Valider
        </button>
      </div>

      {/* Zone de recadrage */}
      <div className="relative flex-1">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropCompleteHandler}
        />
      </div>

      {/* Contrôle zoom */}
      <div className="bg-gray-900 px-4 py-4">
        <div className="flex items-center gap-4 max-w-sm mx-auto">
          <button onClick={() => setZoom(Math.max(1, zoom - 0.1))}
            className="text-white hover:text-gray-300">
            <ZoomOut size={20} />
          </button>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-blue-600"
          />
          <button onClick={() => setZoom(Math.min(3, zoom + 0.1))}
            className="text-white hover:text-gray-300">
            <ZoomIn size={20} />
          </button>
        </div>
        <p className="text-gray-400 text-xs text-center mt-2">
          Faites glisser pour recadrer • Zoom : {zoom.toFixed(1)}x
        </p>
      </div>
    </div>
  );
}