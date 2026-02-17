import { useState, useEffect } from 'react';
import { Star, Quote, Plus, Edit2, Trash2, X, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';
import { Container } from './ui/Container';
import { Card, CardContent } from './ui/card';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  country: string;
  rating: number;
  comment: string;
  photo?: string;
  date: string;
}

export function Testimonials() {
  const { isAuthenticated, accessToken } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    country: '',
    rating: 5,
    comment: '',
    photo: ''
  });
  const [loading, setLoading] = useState(true);

  // Load testimonials from backend
  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('kv_store_27d76fd3')
        .select('value')
        .like('key', 'testimonial:%');

      if (error) {
        throw error;
      }

      if (data) {
        const testimonialsData = data.map(item => item.value);
        // Sort by date descending (newest first)
        testimonialsData.sort((a: Testimonial, b: Testimonial) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTestimonials(testimonialsData);
      }
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast.error('Impossible de charger les témoignages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour gérer les témoignages');
      return;
    }

    const testimonialData = {
      ...formData,
      id: editingId || `testimonial-${Date.now()}`,
      date: new Date().toISOString()
    };

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-27d76fd3/testimonials`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(testimonialData)
        }
      );

      if (response.ok) {
        toast.success(editingId ? 'Témoignage modifié !' : 'Témoignage ajouté !');
        await loadTestimonials();
        resetForm();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Erreur de connexion au serveur');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      country: testimonial.country,
      rating: testimonial.rating,
      comment: testimonial.comment,
      photo: testimonial.photo || ''
    });
    setEditingId(testimonial.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-27d76fd3/testimonials/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        toast.success('Témoignage supprimé !');
        await loadTestimonials();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Erreur de connexion au serveur');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      country: '',
      rating: 5,
      comment: '',
      photo: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <section id="temoignages" className="py-24 bg-background">
        <Container>
          <div className="text-center animate-pulse text-muted-foreground">Chargement des témoignages...</div>
        </Container>
      </section>
    );
  }

  return (
    <section id="temoignages" className="py-24 bg-background">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Témoignages</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Ce Que Disent Nos Clients
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Découvrez les expériences de ceux qui nous ont fait confiance pour
            réaliser leurs rêves d'études à l'étranger.
          </p>
        </div>

        {/* Admin Button */}
        {isAuthenticated && (
          <div className="mb-8 flex justify-center">
            <Button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un Témoignage
            </Button>
          </div>
        )}

        {/* Testimonials Grid */}
        {testimonials.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 bg-muted/20 rounded-xl">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            Aucun témoignage pour le moment.
            {isAuthenticated && " Ajoutez-en un !"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative border-muted bg-card group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 text-primary/10 group-hover:text-primary/20 transition-colors">
                    <Quote className="w-10 h-10" />
                  </div>

                  {/* Rating */}
                  <div className="flex mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-muted-foreground mb-8 text-lg italic leading-relaxed relative z-10">
                    "{testimonial.comment}"
                  </p>

                  {/* Author Info */}
                  <div className="border-t border-border pt-6 flex items-center gap-4">
                    {testimonial.photo ? (
                      <img
                        src={testimonial.photo}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} • <span className="text-primary font-medium">{testimonial.country}</span>
                      </p>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {isAuthenticated && (
                    <div className="mt-6 pt-4 border-t border-border flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(testimonial)}
                        className="flex-1"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(testimonial.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showForm && isAuthenticated && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
              {/* Header */}
              <div className="bg-primary p-6 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-primary-foreground font-bold text-lg">
                    {editingId ? 'Modifier le Témoignage' : 'Ajouter un Témoignage'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-primary-foreground/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jean Dupont"
                      required
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle/Situation *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Étudiant en médecine"
                      required
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays de destination *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Canada"
                      required
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating">Note (1-5) *</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                      required
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Photo (URL - optionnel)</Label>
                  <Input
                    id="photo"
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    placeholder="https://exemple.com/photo.jpg"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Témoignage *</Label>
                  <Textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Partagez votre expérience avec OMEGA24 CONSULTING..."
                    required
                    rows={6}
                    className="bg-background"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {editingId ? 'Mettre à jour' : 'Ajouter'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}