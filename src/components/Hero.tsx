import { useCallback, memo } from 'react';
import { GraduationCap, Globe, Award, Users } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const Hero = memo(function Hero() {
  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section id="accueil" className="relative pt-20">
      {/* Hero Banner */}
      <div className="relative h-[600px] bg-gradient-to-r from-[#002F6C] to-[#4DA6FF] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1563477709790-27c59ddaa002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBzdHVkeWluZyUyMGFicm9hZHxlbnwxfHx8fDE3NjM2NTQ2NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Études à l'étranger"
            className="w-full h-full object-cover"
            priority={true}
          />
        </div>

        <div className="relative max-w-7xl h-full flex items-center p-[32px]">
          <div className="max-w-3xl">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="text-white">🎓 Votre Avenir Commence Ici</span>
            </div>
            <h1 className="text-white mb-6">
              Réalisez Vos Rêves d'Études à l'Étranger
            </h1>
            <p className="text-white/90 text-xl mb-8 max-w-2xl">
              OMEGA24 CONSULTING vous accompagne dans toutes vos démarches pour étudier
              à l'étranger : orientation, admission, visa, logement et bien plus encore.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => scrollToSection('services')}
                className="bg-[#4DA6FF] hover:bg-white hover:text-[#002F6C] text-white px-8 py-6"
                size="lg"
              >
                Découvrir nos services
              </Button>
              <Button
                onClick={() => scrollToSection('contact')}
                variant="outline"
                className="bg-[#4DA6FF] hover:bg-white hover:text-[#002F6C] text-white px-8 py-6"
                size="lg"
              >
                Commencer mon projet
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-[#F4F4F4] p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#4DA6FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="text-[#002F6C] mb-1">50+</div>
              <p className="text-gray-600">Pays Partenaires</p>
            </div>

            <div className="bg-[#F4F4F4] p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#4DA6FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-[#002F6C] mb-1">1000+</div>
              <p className="text-gray-600">Étudiants Accompagnés</p>
            </div>

            <div className="bg-[#F4F4F4] p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#4DA6FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="text-[#002F6C] mb-1">200+</div>
              <p className="text-gray-600">Universités Partenaires</p>
            </div>

            <div className="bg-[#F4F4F4] p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#4DA6FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-[#002F6C] mb-1">95%</div>
              <p className="text-gray-600">Taux de Réussite</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});