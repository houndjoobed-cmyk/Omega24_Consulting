import { useCallback, memo, useState, useEffect } from 'react';
import { GraduationCap, Globe, Award, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Container } from './ui/Container';
import { FadeIn, StaggerContainer } from './ui/motion';

import imgStudies from '@/assets/optimized/students-as-colleagues-start-up-team-drink-coffee-together-celebrate.jpg.webp';
import imgParis from '@/assets/optimized/family-enjoying-their-trip-paris.jpg.webp';
import imgWork from '@/assets/optimized/multi-ethnic-stockroom-supervisor-packing-parcels.jpg.webp';
import imgSelfie from '@/assets/optimized/black-girl-taking-selfie-with-classmates.jpg.webp';

const slides = [
  {
    image: imgStudies,
    badge: '🎓 Votre Avenir Commence Ici',
    title: 'Réalisez Vos Rêves',
    highlight: "d'Études à l'Étranger",
    description: 'OMEGA24 CONSULTING vous accompagne dans toutes vos démarches : orientation, admission, visa, logement et bien plus encore.',
    cta: { label: 'Découvrir nos services', section: 'services' },
    cta2: { label: 'Nous Contacter', section: 'contact' },
  },
  {
    image: imgParis,
    badge: '💼 Opportunités Professionnelles',
    title: 'Trouvez un Contrat',
    highlight: "de Travail à l'International",
    description: "Nous vous aidons à décrocher un emploi dans 13 pays : Allemagne, Canada, Qatar, et bien d'autres. Accompagnement complet du CV au contrat.",
    cta: { label: 'Voir les pays disponibles', section: 'cequenoousproposons' },
    cta2: { label: 'Nous Contacter', section: 'contact' },
  },
  {
    image: imgWork,
    badge: '🏠 Immobilier & Locatif',
    title: 'Gestion Locative',
    highlight: '& Transactions Immobilières',
    description: 'Achat, vente, mutation de noms, titre foncier, Guest House — nous gérons vos biens immobiliers au Bénin avec professionnalisme.',
    cta: { label: 'En savoir plus', section: 'cequenoousproposons' },
    cta2: { label: 'Nous Contacter', section: 'contact' },
  },
  {
    image: imgSelfie,
    badge: '🛡️ Protection & Sécurité',
    title: 'Toutes Vos Assurances',
    highlight: 'en Un Seul Endroit',
    description: 'Assurance santé, voyage, habitation, auto & moto — Omega24 Consulting vous protège et sécurise votre avenir et celui de vos proches.',
    cta: { label: 'Obtenir un devis', section: 'contact' },
    cta2: { label: 'Découvrir nos services', section: 'services' },
  },
];

export const Hero = memo(function Hero() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isHovered, next]);

  const slide = slides[current];

  return (
    <section id="accueil" className="relative pt-0">
      {/* Hero Banner — pleine hauteur avec image cross-fade */}
      <div
        className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Images de fond en couches superposées — cross-fade via opacity */}
        {slides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <img
              src={s.image}
              alt=""
              className="w-full h-full object-cover"
            />
            {/* Overlay sombre pour lisibilité du texte */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#031477]/75 via-[#031477]/30 to-[#031477]/15" />
          </div>
        ))}

        {/* Flèche gauche */}
        <button
          onClick={prev}
          aria-label="Diapositive précédente"
          className="absolute left-2 bottom-6 md:bottom-auto md:left-8 md:top-1/2 md:-translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white transition-all hover:scale-110 backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Flèche droite */}
        <button
          onClick={next}
          aria-label="Diapositive suivante"
          className="absolute right-2 bottom-6 md:bottom-auto md:right-8 md:top-1/2 md:-translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white transition-all hover:scale-110 backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Contenu texte — aligné en haut */}
        <Container className="relative z-10 pt-20 md:pt-28 pb-20 md:pb-8">
          <div className="max-w-4xl mx-auto text-center">

            {/* Badge */}
            <div
              key={`badge-${current}`}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full mb-8 shadow-lg animate-fade-in-up"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#00deff] animate-pulse" />
              <span className="font-sans font-semibold text-xs tracking-widest uppercase text-white">
                {slide.badge}
              </span>
            </div>

            {/* Titre */}
            <h1
              key={`title-${current}`}
              className="text-white mb-6 font-heading font-bold leading-none text-4xl md:text-5xl lg:text-6xl animate-fade-in-up"
              style={{ animationDelay: '60ms', letterSpacing: '-0.03em' }}
            >
              {slide.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00deff] to-white/80">
                {slide.highlight}
              </span>
            </h1>

            {/* Description */}
            <p
              key={`desc-${current}`}
              className="font-sans font-normal text-white/90 text-base md:text-xl mb-8 md:mb-12 max-w-3xl mx-auto leading-normal animate-fade-in-up"
              style={{ animationDelay: '120ms' }}
            >
              {slide.description}
            </p>

            {/* Boutons CTA */}
            <div
              key={`cta-${current}`}
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
              style={{ animationDelay: '180ms' }}
            >
              <Button
                onClick={() => scrollToSection(slide.cta.section)}
                className="bg-[#031477] hover:bg-white hover:text-[#031477] text-white text-lg px-10 py-6 rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all border border-[#031477]"
                size="lg"
              >
                {slide.cta.label}
              </Button>
              <Button
                onClick={() => scrollToSection(slide.cta2.section)}
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/40 text-white hover:bg-white hover:text-[#031477] text-lg px-10 py-6 rounded-lg shadow-lg hover:-translate-y-1 transition-all"
                size="lg"
              >
                {slide.cta2.label}
              </Button>
            </div>
          </div>
        </Container>

        {/* Dégradé bas vers le fond de page */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Stats Section */}
      <Container className="relative z-20 -mt-20 mb-20">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={100} delay={500}>
          {[
            { icon: Globe, value: '50+', label: 'Pays Partenaires' },
            { icon: Users, value: '1000+', label: 'Étudiants Accompagnés' },
            { icon: GraduationCap, value: '200+', label: 'Universités Partenaires' },
            { icon: Award, value: '95%', label: 'Taux de Réussite' },
          ].map((stat, i) => (
            <FadeIn key={i} className="h-full">
              <div className="bg-card text-card-foreground p-6 rounded-xl shadow-lg border hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center group h-full">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:rotate-6 transition-all duration-300">
                  <stat.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
});
