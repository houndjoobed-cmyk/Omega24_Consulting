import { X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import type { Flyer } from '../App';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from './ui/carousel';
import { cn } from './ui/utils';

interface FlyerViewerProps {
  flyer: Flyer;
  onClose: () => void;
}

export function FlyerViewer({ flyer, onClose }: FlyerViewerProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Normalize images to always have an array
  const displayImages = (flyer.images?.length > 0
    ? flyer.images
    : [(flyer as any).image].filter(Boolean) as string[]
  ).filter(url => typeof url === 'string' && url.length > 0);

  const fallbackImage = 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=1200&auto=format&fit=crop&q=60';

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col md:flex-row">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Carousel Section */}
        <div className="w-full md:w-2/3 bg-black/5 flex flex-col justify-center p-4 relative">
          <Carousel setApi={setApi} className="w-full h-full flex flex-col justify-center">
            <CarouselContent>
              {displayImages.map((src, index) => (
                <CarouselItem key={index} className="flex items-center justify-center h-[50vh] md:h-[70vh]">
                  <div className="relative w-full h-full p-2">
                    <img
                      src={src || fallbackImage}
                      alt={`${flyer.title} - ${index + 1}`}
                      className="w-full h-full object-contain rounded-lg shadow-sm"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {displayImages.length > 1 && (
              <>
                <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/30 border-none text-white" />
                <CarouselNext className="right-4 bg-white/10 hover:bg-white/30 border-none text-white" />
              </>
            )}
          </Carousel>

          {/* Thumbnails Overlay (Desktop) or Below (Mobile) */}
          {displayImages.length > 1 && (
            <div className="flex gap-2 mt-4 justify-center overflow-x-auto py-2 px-4">
              {displayImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={cn(
                    "relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all",
                    current === index
                      ? "border-[#4DA6FF] ring-2 ring-[#4DA6FF]/30 opacity-100"
                      : "border-transparent opacity-50 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col bg-white overflow-y-auto max-h-[40vh] md:max-h-[90vh]">
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
            <div className="mt-auto pt-6 border-t border-gray-100">
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
  );
}
