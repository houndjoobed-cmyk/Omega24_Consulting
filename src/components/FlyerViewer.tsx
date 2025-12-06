import { X } from 'lucide-react';
import { Button } from './ui/button';
import type { Flyer } from '../App';

interface FlyerViewerProps {
  flyer: Flyer;
  onClose: () => void;
}

export function FlyerViewer({ flyer, onClose }: FlyerViewerProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#002F6C] text-white p-4 flex items-center justify-between z-10">
          <h3>{flyer.title}</h3>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          <div className="mb-6">
            <img
              src={flyer.image}
              alt={flyer.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-[#002F6C] mb-3">Description</h4>
            <p className="text-gray-700 text-lg leading-relaxed">
              {flyer.description}
            </p>
          </div>

          {/* Details */}
          {flyer.details && flyer.details.length > 0 && (
            <div>
              <h4 className="text-[#002F6C] mb-3">Détails</h4>
              <ul className="space-y-2">
                {flyer.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-[#4DA6FF] mt-1">▸</span>
                    <span className="text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Close Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={onClose}
              className="bg-[#4DA6FF] hover:bg-[#002F6C] text-white px-8"
            >
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
