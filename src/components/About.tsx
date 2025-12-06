import { Target, Users, Globe, Shield } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function About() {
  return (
    <section id="apropos" className="py-20 bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-block bg-[#4DA6FF]/10 px-4 py-2 rounded-full mb-4">
              <span className="text-[#4DA6FF]">À Propos de Nous</span>
            </div>
            <h2 className="text-[#002F6C] mb-6">
              Votre Partenaire pour Étudier à l'Étranger
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              OMEGA24 CONSULTING est une agence spécialisée dans l'accompagnement 
              des étudiants qui souhaitent poursuivre leurs études à l'étranger.
            </p>
            <p className="text-gray-600 mb-8">
              Nous guidons les jeunes dans toutes leurs démarches : de la définition 
              du projet d'études jusqu'à l'installation dans le pays d'accueil, en 
              passant par les admissions, le visa, le logement et bien plus encore.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#4DA6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[#002F6C] mb-1">Notre Mission</h3>
                  <p className="text-gray-600 text-sm">
                    Faciliter l'accès aux études internationales
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#4DA6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[#002F6C] mb-1">Notre Équipe</h3>
                  <p className="text-gray-600 text-sm">
                    Conseillers experts en mobilité étudiante
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#4DA6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[#002F6C] mb-1">Réseau International</h3>
                  <p className="text-gray-600 text-sm">
                    Partenaires dans plus de 50 pays
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#4DA6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[#002F6C] mb-1">Accompagnement</h3>
                  <p className="text-gray-600 text-sm">
                    Suivi personnalisé de A à Z
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1563477709790-27c59ddaa002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBzdHVkeWluZyUyMGFicm9hZHxlbnwxfHx8fDE3NjM2NTQ2NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Étudiants OMEGA 24 CONSULTING"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002F6C]/50 to-transparent"></div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#4DA6FF] rounded-2xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#002F6C] rounded-2xl -z-10"></div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-20">
          <h3 className="text-[#002F6C] text-center mb-12">
            Pourquoi Choisir OMEGA24 CONSULTING ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-[#4DA6FF] text-5xl mb-4">🎓</div>
              <h4 className="text-[#002F6C] mb-3">Accompagnement Complet</h4>
              <p className="text-gray-600">
                De la définition de votre projet d'études jusqu'à votre installation, 
                nous sommes à vos côtés à chaque étape.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-[#4DA6FF] text-5xl mb-4">💼</div>
              <h4 className="text-[#002F6C] mb-3">Expertise Avérée</h4>
              <p className="text-gray-600">
                Une équipe de conseillers spécialisés qui connaît parfaitement 
                les systèmes éducatifs internationaux.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-[#4DA6FF] text-5xl mb-4">🌍</div>
              <h4 className="text-[#002F6C] mb-3">Réseau Mondial</h4>
              <p className="text-gray-600">
                Des partenariats avec plus de 200 universités dans 50 pays 
                pour vous offrir le maximum d'opportunités.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}