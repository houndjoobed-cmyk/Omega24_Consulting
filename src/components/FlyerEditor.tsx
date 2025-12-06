import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
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
      image: '',
      details: []
    }
  );

  const [imagePreview, setImagePreview] = useState(flyer?.image || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#002F6C] text-white p-6 flex items-center justify-between">
          <h3>
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
            <Label htmlFor="image">Image de l'affiche *</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData({ ...formData, image: '' });
                    }}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Cliquez pour télécharger une image</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
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
              rows={6}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Entrez chaque détail sur une nouvelle ligne
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
              className="flex-1 bg-[#4DA6FF] hover:bg-[#002F6C] text-white"
              disabled={!formData.title || !formData.description || !formData.image}
            >
              {flyer ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
