import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { FormField } from './ui/FormField';
import { Container } from './ui/Container';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { cn } from './ui/utils';

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
    <section id="contact" className="py-24 bg-background border-t border-muted">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Contactez-nous</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Commencez Votre Aventure
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Notre équipe de conseillers est prête à vous accompagner dans la
            réalisation de votre projet d'études à l'étranger.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="border shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-heading text-xl font-bold text-primary mb-6">Informations de Contact</h3>

                <div className="space-y-6">
                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-300">
                      <Phone className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Téléphone</p>
                      <a href="tel:+22901413122222" className="block text-foreground hover:text-primary font-medium transition-colors">+229 01 41 31 22 22</a>
                      <a href="tel:+22901905742422" className="block text-foreground hover:text-primary font-medium transition-colors">+229 01 90 57 42 42</a>
                    </div>
                  </div>

                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-300">
                      <Mail className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                      <a href="mailto:infos@omega24consulting.com" className="text-foreground hover:text-primary font-medium transition-colors break-all">
                        infos@omega24consulting.com
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-300">
                      <Clock className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Horaires</p>
                      <p className="text-foreground font-medium">
                        Lun - Ven: 8h00 - 18h30<br />
                        Sam: 09h00 - 13h00
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-2xl text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6" />
                <h4 className="font-bold text-lg">Besoin de Conseils ?</h4>
              </div>
              <p className="text-white/90 text-sm mb-6 leading-relaxed">
                Prenez rendez-vous directement avec l'un de nos conseillers pour discuter
                de votre projet d'études à l'étranger.
              </p>
              <Button
                variant="secondary"
                className="w-full bg-white text-primary hover:bg-white/90 font-bold border-0"
                size="lg"
                onClick={() => {
                  window.open('https://wa.me/2290141312222?text=Bonjour%20OMEGA%2024%20CONSULTING,%20je%20souhaite%20prendre%20rendez-vous%20pour%20discuter%20de%20mon%20projet.', '_blank');
                }}
              >
                Prendre rendez-vous <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-card">
              <CardContent className="p-8 md:p-10">
                <h3 className="font-heading text-2xl font-bold text-foreground mb-8">Envoyez-nous un message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Votre nom"
                        required
                        className="h-12 bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="votre@email.com"
                        required
                        className="h-12 bg-background"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone (Optionnel)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+229 XX XX XX XX"
                        className="h-12 bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Objet de votre demande"
                        required
                        className="h-12 bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Parlez-nous de votre projet d'études..."
                      required
                      rows={6}
                      className="resize-none bg-background py-4"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white rounded-full mr-2"></div>
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}