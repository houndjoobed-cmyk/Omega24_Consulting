import { useState, useEffect, useRef } from 'react';
import { Star, Quote, Plus, Edit2, Trash2, X, MessageSquare, Upload, Video, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
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
  video_url?: string;
  date: string;
}

const BUCKET = 'testimonials-videos';

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
    photo: '',
    video_url: '',
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('kv_store_27d76fd3')
        .select('value')
        .like('key', 'testimonial:%');

      if (error) throw error;

      if (data) {
        const testimonialsData = data.map(item => item.value);
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

  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME type
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      toast.error('Format non supporté', {
        description: 'Utilisez MP4, WebM ou MOV uniquement.',
      });
      e.target.value = '';
      return;
    }

    const maxSize = 100 * 1024 * 1024; // 100 MB
    if (file.size > maxSize) {
      toast.error('La vidéo doit faire moins de 100 MB');
      e.target.value = '';
      return;
    }

    setVideoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
    setFormData(prev => ({ ...prev, video_url: '' }));
  };

  const uploadVideo = async (): Promise<string | null> => {
    if (!videoFile) return formData.video_url || null;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const ext = videoFile.name.split('.').pop();
      const fileName = `testimonial-${Date.now()}.${ext}`;

      setUploadProgress(30);

      // Use raw fetch to avoid creating a duplicate GoTrueClient
      const uploadRes = await fetch(
        `https://${projectId}.supabase.co/storage/v1/object/${BUCKET}/${fileName}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': videoFile.type,
            'x-upsert': 'false',
          },
          body: videoFile,
        }
      );

      if (!uploadRes.ok) {
        const errBody = await uploadRes.json().catch(() => ({}));
        const msg = errBody?.error || errBody?.message || uploadRes.statusText;
        if (uploadRes.status === 404 || msg?.toLowerCase().includes('not found')) {
          toast.error('Bucket introuvable', {
            description: `Créez un bucket public "${BUCKET}" dans Supabase Storage.`,
            duration: 8000,
          });
        } else {
          toast.error(`Erreur d'upload (${uploadRes.status}) : ${msg}`);
        }
        return null;
      }

      setUploadProgress(80);

      // Build public URL directly — no extra client needed
      const publicUrl = `https://${projectId}.supabase.co/storage/v1/object/public/${BUCKET}/${fileName}`;

      setUploadProgress(100);
      return publicUrl;
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(`Erreur d'upload : ${err.message || 'inconnue'}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour gérer les témoignages');
      return;
    }

    // Upload video first if a file was selected
    const finalVideoUrl = await uploadVideo();

    // If a video was selected but upload failed → abort
    if (videoFile && !finalVideoUrl) {
      toast.error("La vidéo n'a pas pu être téléchargée. Le témoignage n'a pas été sauvegardé.");
      return;
    }

    const testimonialData: Testimonial = {
      ...formData,
      // If no text comment but a video is provided, use a placeholder to satisfy backend validation
      comment: formData.comment.trim() || (finalVideoUrl ? '📹 Témoignage vidéo' : ''),
      video_url: finalVideoUrl || undefined,
      id: editingId || `testimonial-${Date.now()}`,
      date: new Date().toISOString(),
    };

    try {
      // Write directly to kv_store to preserve all fields (including video_url)
      // The Edge Function strips unknown fields, so we bypass it for testimonials with video
      const key = `testimonial:${testimonialData.id}`;
      const kvRes = await fetch(
        `https://${projectId}.supabase.co/rest/v1/kv_store_27d76fd3`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'apikey': publicAnonKey,
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify({ key, value: testimonialData }),
        }
      );

      if (kvRes.ok) {
        toast.success(editingId ? 'Témoignage modifié !' : 'Témoignage ajouté !');
        await loadTestimonials();
        resetForm();
      } else {
        // Fallback: try via Edge Function
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-27d76fd3/testimonials`,
          {
            method: editingId ? 'PUT' : 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(testimonialData),
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
      photo: testimonial.photo || '',
      video_url: testimonial.video_url || '',
    });
    if (testimonial.video_url) {
      setVideoPreview(testimonial.video_url);
    }
    setEditingId(testimonial.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return;
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-27d76fd3/testimonials/${id}`,
        { method: 'DELETE', headers: { 'Authorization': `Bearer ${accessToken}` } }
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
    setFormData({ name: '', role: '', country: '', rating: 5, comment: '', photo: '', video_url: '' });
    setVideoFile(null);
    setVideoPreview(null);
    setUploadProgress(0);
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
            Découvrez les expériences de ceux qui nous ont fait confiance pour réaliser leurs rêves.
          </p>
        </div>

        {/* Admin Button */}
        {isAuthenticated && (
          <div className="mb-8 flex justify-center">
            <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
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
            {isAuthenticated && ' Ajoutez-en un !'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative border-muted bg-card group overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  {/* Video Section */}
                  {testimonial.video_url ? (
                    <div className="relative w-full bg-black rounded-t-xl overflow-hidden">
                      <video
                        src={testimonial.video_url}
                        controls
                        preload="metadata"
                        className="w-full max-h-64 object-cover"
                        poster=""
                      >
                        Votre navigateur ne supporte pas la lecture vidéo.
                      </video>
                    </div>
                  ) : null}

                  <div className="p-8">
                    {/* Quote Icon (only if no video) */}
                    {!testimonial.video_url && (
                      <div className="absolute top-6 right-6 text-primary/10 group-hover:text-primary/20 transition-colors">
                        <Quote className="w-10 h-10" />
                      </div>
                    )}

                    {/* Rating */}
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    {testimonial.comment && (
                      <p className="text-muted-foreground mb-6 text-base italic leading-relaxed relative z-10">
                        "{testimonial.comment}"
                      </p>
                    )}

                    {/* Author Info */}
                    <div className="border-t border-border pt-4 flex items-center gap-4">
                      {testimonial.photo ? (
                        <img
                          src={testimonial.photo}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
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
                        <Button size="sm" variant="outline" onClick={() => handleEdit(testimonial)} className="flex-1">
                          <Edit2 className="w-4 h-4 mr-1" /> Modifier
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(testimonial.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showForm && isAuthenticated && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto border border-border">
              {/* Header */}
              <div className="bg-primary p-6 sticky top-0 z-10 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-primary-foreground font-bold text-lg">
                    {editingId ? 'Modifier le Témoignage' : 'Ajouter un Témoignage'}
                  </h3>
                  <button onClick={resetForm} className="text-primary-foreground/80 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Nom & Rôle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Marie Dupont" required className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle/Situation *</Label>
                    <Input id="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="Étudiante en médecine" required className="bg-background" />
                  </div>
                </div>

                {/* Pays & Note */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays de destination *</Label>
                    <Input id="country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="Canada" required className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Note (1-5) *</Label>
                    <Input id="rating" type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })} required className="bg-background" />
                  </div>
                </div>

                {/* Photo URL */}
                <div className="space-y-2">
                  <Label htmlFor="photo">Photo (URL — optionnel)</Label>
                  <Input id="photo" value={formData.photo} onChange={(e) => setFormData({ ...formData, photo: e.target.value })} placeholder="https://exemple.com/photo.jpg" className="bg-background" />
                </div>

                {/* ── VIDÉO — Upload ── */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-primary" />
                    Vidéo témoignage (optionnel)
                  </Label>

                  {/* Drop zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative border-2 border-dashed border-primary/30 hover:border-primary/60 rounded-xl p-6 text-center cursor-pointer transition-all bg-primary/5 hover:bg-primary/10"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/*"
                      onChange={handleVideoSelect}
                      className="sr-only"
                    />
                    {videoPreview ? (
                      <div className="space-y-3">
                        <video src={videoPreview} controls className="w-full max-h-48 rounded-lg mx-auto" />
                        <p className="text-sm text-muted-foreground">
                          {videoFile ? videoFile.name : 'Vidéo actuelle'} —{' '}
                          <span className="text-primary underline">Changer</span>
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-10 h-10 mx-auto text-primary/60" />
                        <p className="font-medium text-foreground">Cliquer pour sélectionner une vidéo</p>
                        <p className="text-xs text-muted-foreground">MP4, WebM, MOV — max 100 MB</p>
                      </div>
                    )}
                  </div>

                  {/* Ou URL directe */}
                  {!videoFile && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground text-center">— ou coller une URL vidéo —</p>
                      <Input
                        value={formData.video_url}
                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                        placeholder="https://exemple.com/video.mp4"
                        className="bg-background text-sm"
                      />
                    </div>
                  )}

                  {/* Progress bar */}
                  {isUploading && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Upload en cours...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Commentaire */}
                <div className="space-y-2">
                  <Label htmlFor="comment">Témoignage écrit (optionnel si vidéo)</Label>
                  <Textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Partagez votre expérience avec OMEGA24 CONSULTING..."
                    rows={4}
                    className="bg-background"
                  />
                </div>

                {/* Boutons */}
                <div className="flex gap-4 pt-2">
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isUploading} className="flex-1 bg-primary hover:bg-primary/90">
                    {isUploading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Upload...</>
                    ) : (
                      editingId ? 'Mettre à jour' : 'Ajouter'
                    )}
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