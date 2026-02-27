import { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { supabase } from '../utils/supabase/client';
import type { Flyer } from '../App';

interface FlyerEditorProps {
  flyer: Flyer | null;
  onSave: (flyer: Flyer) => void;
  onClose: () => void;
}

export function FlyerEditor({ flyer, onSave, onClose }: FlyerEditorProps) {
  const [formData, setFormData] = useState<Flyer>(
    flyer || {
      id: '',
      title: '',
      description: '',
      images: [],
      details: []
    }
  );

  const [imagePreviews, setImagePreviews] = useState<string[]>(flyer?.images || []);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Aggressive compression
          const MAX_SIZE = 600;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress quality
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploading(true);
      const newFiles = Array.from(files);
      for (const file of newFiles) {
        try {
          // 1. Compress
          const base64 = await compressImage(file);

          // 2. Immediate preview (base64)
          setImagePreviews(prev => [...prev, base64]);

          // 3. Convert base64 to Blob for Storage upload (no fetch needed — avoids CSP violation)
          const base64Data = base64.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteArray = new Uint8Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i);
          }
          const blob = new Blob([byteArray], { type: 'image/jpeg' });

          // 4. Upload to Supabase Storage
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
          const { data, error } = await supabase.storage
            .from('services')
            .upload(fileName, blob, {
              contentType: 'image/jpeg',
              cacheControl: '3600'
            });

          if (error) throw error;

          // 5. Get Public URL (Safe method)
          const { data: urlData } = supabase.storage
            .from('services')
            .getPublicUrl(data.path);

          const publicUrl = urlData.publicUrl;

          // 6. Update form data with the URL
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, publicUrl]
          }));
        } catch (error) {
          console.error('Upload error:', error);
          alert('Erreur lors de l\'envoi de l\'image');
        }
      }
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length < 1) {
      alert('Veuillez ajouter au moins 1 image pour cette affiche.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#002F6C] text-white p-6 flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg">
            {flyer ? 'Modifier l\'affiche' : 'Nouvelle affiche'}
          </h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <Label htmlFor="image">Images de l'affiche (Min. 1) *</Label>
            <div className="mt-2 space-y-4">
              {/* Previews Grid */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {/* Small add button in the grid */}
                  <label className={`flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Plus className="w-6 h-6 text-gray-400" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      disabled={uploading}
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              )}

              {/* Empty State Upload Area */}
              {imagePreviews.length === 0 && (
                <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 font-medium">
                    {uploading ? 'Envoi en cours...' : 'Cliquez pour ajouter des images (min. 1)'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    onChange={handleImageUpload}
                  />
                </label>
              )}

              <div className="flex justify-between items-center text-xs">
                <span className={formData.images.length < 1 ? "text-red-500 font-medium" : "text-green-600 font-medium"}>
                  {formData.images.length} image(s) ajoutée(s) (Recommandé : 1 à 10)
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Service d'Assurance"
              required
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez votre service..."
              required
              rows={4}
              className="mt-1"
            />
          </div>

          {/* Details */}
          <div>
            <Label htmlFor="details">Détails (un par ligne)</Label>
            <Textarea
              id="details"
              value={formData.details?.join('\n') || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  details: e.target.value.split('\n').filter(d => d.trim())
                })
              }
              placeholder="Détail 1&#10;Détail 2&#10;Détail 3"
              rows={4}
              className="mt-1"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#4DA6FF] hover:bg-[#002F6C] text-white transition-colors"
              disabled={!formData.title || !formData.description || formData.images.length < 1 || uploading}
            >
              {flyer ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
