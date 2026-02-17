import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { FlyerCard } from './FlyerCard';
import { FlyerEditor } from './FlyerEditor';
import { FlyerViewer } from './FlyerViewer';
import { useAuth } from '../contexts/AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Container } from './ui/Container';
import { FadeIn, StaggerContainer } from './ui/motion';
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
    <section id="services" className="py-24 bg-muted/40">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16">
          <FadeIn>
            <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Nos Services</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Découvrez Nos Offres
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Consultez nos différents services et offres disponibles pour vous accompagner.
            </p>
          </FadeIn>
        </div>

        {/* Admin Button */}
        {isAuthenticated && (
          <div className="mb-8 flex justify-end">
            <Button
              onClick={handleAddFlyer}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une affiche
            </Button>
          </div>
        )}

        {/* Flyers Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={100}>
          {flyers.map((flyer) => (
            <FadeIn key={flyer.id} className="h-full">
              <FlyerCard
                flyer={flyer}
                onEdit={isAuthenticated ? handleEditFlyer : undefined}
                onDelete={isAuthenticated ? handleDeleteFlyer : undefined}
                onView={handleViewFlyer}
              />
            </FadeIn>
          ))}
        </StaggerContainer>

        {/* Empty State */}
        {flyers.length === 0 && (
          <div className="text-center py-24 bg-card rounded-xl border border-dashed border-muted-foreground/20">
            <div className="text-muted-foreground/30 mb-6">
              <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-muted-foreground text-lg mb-6">Aucune affiche disponible pour le moment</p>
            {isAuthenticated && (
              <Button
                onClick={handleAddFlyer}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer votre première affiche
              </Button>
            )}
          </div>
        )}
      </Container>

      {/* Modals */}
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

      {viewingFlyer && (
        <FlyerViewer
          flyer={viewingFlyer}
          onClose={() => setViewingFlyer(null)}
        />
      )}
    </section>
  );
}