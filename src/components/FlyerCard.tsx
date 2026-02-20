import { useState, useEffect, useCallback } from 'react';
import { Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import type { Flyer } from '../App';

interface FlyerCardProps {
  flyer: Flyer;
  onEdit?: (flyer: Flyer) => void;
  onDelete?: (flyerId: string) => void;
  onView: (flyer: Flyer) => void;
}

export function FlyerCard({ flyer, onEdit, onDelete, onView }: FlyerCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Build images array : support both flyer.images[] and flyer.image (legacy)
  const images: string[] = (flyer.images && flyer.images.length > 0)
    ? flyer.images
    : [(flyer as any).image || 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&auto=format&fit=crop&q=60'];

  const hasMultiple = images.length > 1;

  const next = useCallback(() => {
    setCurrentImg((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrentImg((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-play — pause on hover
  useEffect(() => {
    if (!hasMultiple || isHovered) return;
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [hasMultiple, isHovered, next]);

  return (
    <div
      className="group relative bg-card text-card-foreground rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Flyer Image(s) */}
      <div className="relative h-[400px] overflow-hidden bg-muted">
        {!isLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}

        {/* Cross-fade layers */}
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={i === 0 ? flyer.title : `${flyer.title} — image ${i + 1}`}
            loading="lazy"
            onLoad={() => { if (i === 0) setIsLoaded(true); }}
            onError={() => { if (i === 0) setIsLoaded(true); }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:scale-105
              ${i === currentImg ? 'opacity-100' : 'opacity-0'}
              ${isLoaded ? '' : 'invisible'}
            `}
          />
        ))}

        {/* Arrows — visible only if multiple images and on hover */}
        {hasMultiple && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Image précédente"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Image suivante"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentImg(i); }}
                  aria-label={`Image ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${i === currentImg ? 'w-5 h-1.5 bg-[#00deff]' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#002F6C]/90 via-[#002F6C]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 z-20">
          <div className="w-full">
            <h3 className="text-white mb-2">
              {flyer.title}
            </h3>
            <p className="text-white/80 text-sm line-clamp-2 mb-4">
              {flyer.description}
            </p>
            <Button
              onClick={() => onView(flyer)}
              variant="outline"
              className="w-full bg-transparent text-white border-white hover:bg-white hover:text-[#002F6C] transition-all duration-300"
            >
              <Eye className="w-4 h-4 mr-2" />
              Voir les détails
            </Button>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 bg-[#F4F4F4]">
        <h4 className="text-[#002F6C] mb-2">
          {flyer.title}
        </h4>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {flyer.description}
        </p>

        {/* Admin Actions */}
        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <Button
                onClick={() => onEdit(flyer)}
                variant="outline"
                size="sm"
                className="flex-1 border-[#4DA6FF] text-[#4DA6FF] hover:bg-[#4DA6FF] hover:text-white"
              >
                <Edit className="w-4 h-4 mr-1" />
                Modifier
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={() => onDelete(flyer.id)}
                variant="outline"
                size="sm"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Supprimer
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}