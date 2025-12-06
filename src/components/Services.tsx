import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { FlyerCard } from './FlyerCard';
import { FlyerEditor } from './FlyerEditor';
import { FlyerViewer } from './FlyerViewer';
import { useAuth } from '../contexts/AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import type { Flyer } from '../App';

interface ServicesProps {
  flyers: Flyer[];
  onUpdateFlyers: (flyers: Flyer[]) => void;
}

export function Services({ flyers, onUpdateFlyers }: ServicesProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingFlyer, setEditingFlyer] = useState<Flyer | null>(null);
  const [viewingFlyer, setViewingFlyer] = useState<Flyer | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, accessToken } = useAuth();

  // Load flyers from backend on mount
  useEffect(() => {
    loadFlyers();
  }, []);

  const loadFlyers = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-27d76fd3/flyers`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.flyers && data.flyers.length > 0) {
          onUpdateFlyers(data.flyers);
        }
      }
    } catch (error) {
      console.error('Error loading flyers:', error);
    }
  };

  const handleAddFlyer = () => {
    setEditingFlyer(null);
    setIsEditorOpen(true);
  };

  const handleEditFlyer = (flyer: Flyer) => {
    setEditingFlyer(flyer);
    setIsEditorOpen(true);
  };

  const handleDeleteFlyer = async (flyerId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette affiche ?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-27d76fd3/flyers/${flyerId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        onUpdateFlyers(flyers.filter(f => f.id !== flyerId));
      } else {
        const error = await response.json();
        alert('Erreur: ' + (error.error || 'Impossible de supprimer'));
      }
    } catch (error) {
      console.error('Error deleting flyer:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const handleViewFlyer = (flyer: Flyer) => {
    setViewingFlyer(flyer);
  };

  const handleSaveFlyer = async (flyer: Flyer) => {
    setLoading(true);
    try {
      const flyerToSave = editingFlyer 
        ? flyer 
        : { ...flyer, id: Date.now().toString() };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-27d76fd3/flyers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(flyerToSave),
        }
      );

      if (response.ok) {
        if (editingFlyer) {
          onUpdateFlyers(flyers.map(f => f.id === flyer.id ? flyerToSave : f));
        } else {
          onUpdateFlyers([...flyers, flyerToSave]);
        }
        setIsEditorOpen(false);
        setEditingFlyer(null);
      } else {
        const error = await response.json();
        alert('Erreur: ' + (error.error || 'Impossible de sauvegarder'));
      }
    } catch (error) {
      console.error('Error saving flyer:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="services" className="py-20 bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-[#4DA6FF]/10 px-4 py-2 rounded-full mb-4">
            <span className="text-[#4DA6FF]">Nos Services</span>
          </div>
          <h2 className="text-[#002F6C] mb-4">
            Découvrez Nos Offres
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Consultez nos différents services et offres disponibles pour vous accompagner.
          </p>
        </div>

        {/* Admin Button - Only visible when authenticated */}
        {isAuthenticated && (
          <div className="mb-8 flex justify-end">
            <Button
              onClick={handleAddFlyer}
              disabled={loading}
              className="bg-[#002F6C] hover:bg-[#4DA6FF] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une affiche
            </Button>
          </div>
        )}

        {/* Flyers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {flyers.map((flyer) => (
            <FlyerCard
              key={flyer.id}
              flyer={flyer}
              onEdit={isAuthenticated ? handleEditFlyer : undefined}
              onDelete={isAuthenticated ? handleDeleteFlyer : undefined}
              onView={handleViewFlyer}
            />
          ))}
        </div>

        {/* Empty State */}
        {flyers.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">Aucune affiche disponible pour le moment</p>
            {isAuthenticated && (
              <Button
                onClick={handleAddFlyer}
                className="bg-[#4DA6FF] hover:bg-[#002F6C] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer votre première affiche
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Flyer Editor Modal */}
      {isEditorOpen && (
        <FlyerEditor
          flyer={editingFlyer}
          onSave={handleSaveFlyer}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingFlyer(null);
          }}
        />
      )}

      {/* Flyer Viewer Modal */}
      {viewingFlyer && (
        <FlyerViewer
          flyer={viewingFlyer}
          onClose={() => setViewingFlyer(null)}
        />
      )}
    </section>
  );
}