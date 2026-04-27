'use client';
import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Lightbox({ image, titre, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Bouton fermer */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10 bg-black bg-opacity-50 rounded-full p-2">
        <X size={24} />
      </button>

      {/* Image */}
      <div className="max-w-5xl max-h-screen p-4" onClick={(e) => e.stopPropagation()}>
        <img
          src={image}
          alt={titre}
          className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
        />
        {titre && (
          <p className="text-white text-center mt-3 text-sm opacity-70">{titre}</p>
        )}
      </div>
    </div>
  );
}
