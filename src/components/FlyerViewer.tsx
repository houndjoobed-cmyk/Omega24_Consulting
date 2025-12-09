import { X } from 'lucide-react';
import type { Flyer } from '../App';

interface FlyerViewerProps {
  flyer: Flyer;
  onClose: () => void;
}

export function FlyerViewer({ flyer, onClose }: FlyerViewerProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">

        {/* Close Button - Absolute & Floating */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/10 hover:bg-black/20 text-gray-800 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row min-h-[400px]">
          {/* Image Section - Full width on mobile, Left side on desktop */}
          <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
            <img
              src={flyer.image}
              alt={flyer.title}
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-sm"
              style={{ maxHeight: '600px' }}
            />
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium tracking-wide border border-blue-100 mb-4">
                Détails de l'offre
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-heading leading-tight">
                {flyer.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {flyer.description}
              </p>
            </div>

            {/* Details List */}
            {flyer.details && flyer.details.length > 0 && (
              <div className="mt-4 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  Ce qui est inclus
                </h4>
                <ul className="space-y-3">
                  {flyer.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
                      <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
