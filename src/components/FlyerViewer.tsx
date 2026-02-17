import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { Flyer } from '../App';

interface FlyerViewerProps {
  flyer: Flyer;
  onClose: () => void;
}

export function FlyerViewer({ flyer, onClose }: FlyerViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Normalize images to always have an array, supporting legacy format
  const displayImages = (flyer.images?.length > 0
    ? flyer.images
    : [(flyer as any).image].filter(Boolean) as string[]
  ).filter(url => typeof url === 'string' && url.length > 0);

  const fallbackImage = 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=1200&auto=format&fit=crop&q=60';

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

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

        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* Image Section */}
          <div className="w-full md:w-1/2 bg-gray-50 flex flex-col p-4 md:p-8">
            {/* Main Image View */}
            <div className="relative aspect-[4/5] bg-slate-100 flex items-center justify-center overflow-hidden rounded-lg shadow-md">
              <img
                src={displayImages[currentImageIndex] || fallbackImage}
                alt={`${flyer.title} - Image ${currentImageIndex + 1}`}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                  console.error("FlyerViewer: Failed to load image", displayImages[currentImageIndex]);
                  setIsLoaded(true); // Stop spinner
                }}
                className={`max-w-full max-h-[60vh] object-contain transition-all duration-500 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              />

              {!isLoaded && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-[#4DA6FF] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {/* Navigation Arrows */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#002F6C] p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#002F6C] p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {displayImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none justify-center">
                {displayImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${currentImageIndex === index ? 'border-[#4DA6FF] ring-2 ring-[#4DA6FF]/20' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-[#4DA6FF]/10 text-[#002F6C] rounded-full text-xs font-semibold tracking-wide border border-[#4DA6FF]/20 mb-4">
                Détails de l'offre
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-[#002F6C] mb-4 font-heading leading-tight">
                {flyer.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {flyer.description}
              </p>
            </div>

            {/* Details List */}
            {flyer.details && flyer.details.length > 0 && (
              <div className="mt-4 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-[#002F6C] uppercase tracking-wider mb-4">
                  Ce qui est inclus
                </h4>
                <ul className="space-y-3">
                  {flyer.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#4DA6FF] group-hover:scale-125 transition-transform" />
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
