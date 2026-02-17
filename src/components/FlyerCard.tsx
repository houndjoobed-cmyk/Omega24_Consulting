import { useState } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
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
  const imageUrl = flyer.images?.[0] || (flyer as any).image || 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&auto=format&fit=crop&q=60';

  return (
    <div className="group relative bg-card text-card-foreground rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* Flyer Image */}
      <div className="relative h-[400px] overflow-hidden bg-muted">
        {!isLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        <img
          src={imageUrl}
          alt={flyer.title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#002F6C]/90 via-[#002F6C]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
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

        {/* Admin Actions - Only show if onEdit and onDelete are provided */}
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