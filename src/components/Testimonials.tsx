import { useState, useEffect } from 'react';
import { Star, Quote, Plus, Edit2, Trash2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

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
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-27d76fd3/testimonials`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (error) {
      console.error('Error loading testimonials:', error);
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
      <section id="temoignages" className="py-20 bg-[#F4F4F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">Chargement des témoignages...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="temoignages" className="py-20 bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-block bg-[#4DA6FF]/10 px-4 py-2 rounded-full mb-4">
            <span className="text-[#4DA6FF]">Témoignages</span>
          </div>
          <h2 className="text-[#002F6C] mb-4">
            Ce Que Disent Nos Clients
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Découvrez les expériences de ceux qui nous ont fait confiance pour 
            réaliser leurs rêves d'études à l'étranger.
          </p>
        </div>

        {/* Admin Button */}
        {isAuthenticated && (
          <div className="mb-8 flex justify-center">
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[#4DA6FF] hover:bg-[#002F6C]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un Témoignage
            </Button>
          </div>
        )}

        {/* Testimonials Grid */}
        {testimonials.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            Aucun témoignage pour le moment.
            {isAuthenticated && " Ajoutez-en un !"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-[#4DA6FF]/20">
                  <Quote className="w-12 h-12" />
                </div>

                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.comment}"
                </p>

                {/* Author Info */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-4">
                    {testimonial.photo ? (
                      <img
                        src={testimonial.photo}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#4DA6FF] flex items-center justify-center text-white">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-[#002F6C]">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">
                        {testimonial.role} • {testimonial.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                {isAuthenticated && (
                  <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
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
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showForm && isAuthenticated && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#002F6C] to-[#4DA6FF] p-6 sticky top-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-white">
                    {editingId ? 'Modifier le Témoignage' : 'Ajouter un Témoignage'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-white/80 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jean Dupont"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Rôle/Situation *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Étudiant en médecine"
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Pays de destination *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Canada"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="rating">Note (1-5) *</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="photo">Photo (URL - optionnel)</Label>
                  <Input
                    id="photo"
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    placeholder="https://exemple.com/photo.jpg"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="comment">Témoignage *</Label>
                  <Textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Partagez votre expérience avec OMEGA24 CONSULTING..."
                    required
                    rows={6}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-3 pt-4">
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
                    className="flex-1 bg-[#4DA6FF] hover:bg-[#002F6C]"
                  >
                    {editingId ? 'Mettre à jour' : 'Ajouter'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}