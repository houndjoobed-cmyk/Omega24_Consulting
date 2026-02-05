import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-27d76fd3/contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (response.ok) {
        toast.success('Message envoyé !', {
          description: 'Nous vous répondrons dans les plus brefs délais.'
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        const error = await response.json();
        toast.error('Erreur d\'envoi', {
          description: error.error || 'Une erreur est survenue. Veuillez réessayer.'
        });
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      toast.error('Erreur de connexion', {
        description: 'Impossible de contacter le serveur. Vérifiez votre connexion.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-[#4DA6FF]/10 px-4 py-2 rounded-full mb-4">
            <span className="text-[#4DA6FF]">Contactez-nous</span>
          </div>
          <h2 className="text-[#002F6C] mb-4">
            Commencez Votre Aventure Aujourd'hui
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Notre équipe de conseillers est prête à vous accompagner dans la
            réalisation de votre projet d'études à l'étranger.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#F4F4F4] p-6 rounded-lg">
              <h3 className="text-[#002F6C] mb-6">Informations de Contact</h3>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#4DA6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                    <a href="tel:+22901413122222" className="text-[#002F6C] hover:text-[#4DA6FF]">
                      +229 01 41 31 22 22
                    </a>
                    <br />
                    <a href="tel:+22901905742422" className="text-[#002F6C] hover:text-[#4DA6FF]">
                      +229 01 90 57 42 42
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#4DA6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-[15px]">
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <a href="mailto:infos@omega24consulting.com" className="text-[#002F6C] hover:text-[#4DA6FF] break-all">
                      infos@omega24consulting.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#4DA6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Horaires</p>
                    <p className="text-[#002F6C]">
                      Lun - Ven: 8h00 - 18h30<br />
                      Sam: 09h00 - 13h00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#002F6C] to-[#4DA6FF] p-6 rounded-lg text-white">
              <h4 className="mb-2">Besoin de Conseils ?</h4>
              <p className="text-sm opacity-90 mb-4">
                Prenez rendez-vous avec l'un de nos conseillers pour discuter
                de votre projet d'études à l'étranger.
              </p>
              <Button
                variant="secondary"
                className="w-full bg-white text-[#002F6C] hover:bg-gray-100"
                onClick={() => {
                  window.open('https://wa.me/2290141312222?text=Bonjour%20OMEGA%2024%20CONSULTING,%20je%20souhaite%20prendre%20rendez-vous%20pour%20discuter%20de%20mon%20projet.', '_blank');
                }}
              >
                Prendre rendez-vous
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-[#F4F4F4] p-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Votre nom"
                    required
                    className="mt-1 bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre@email.com"
                    required
                    className="mt-1 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+229 XX XX XX XX"
                    className="mt-1 bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Sujet *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Objet de votre demande"
                    required
                    className="mt-1 bg-white"
                  />
                </div>
              </div>

              <div className="mb-6">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Parlez-nous de votre projet d'études..."
                  required
                  rows={6}
                  className="mt-1 bg-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#4DA6FF] hover:bg-[#002F6C] text-white"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full mr-2"></div>
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Envoyer le message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}