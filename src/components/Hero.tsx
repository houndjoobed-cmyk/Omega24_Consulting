import { useCallback, memo } from 'react';
import { GraduationCap, Globe, Award, Users } from 'lucide-react';
import logoImage from '@/assets/logo-omega.png';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Container } from './ui/Container';
import { FadeIn, StaggerContainer } from './ui/motion';
import OrbitingCircles from './ui/orbiting-circles';

export const Hero = memo(function Hero() {
  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section id="accueil" className="relative pt-0">
      {/* Hero Banner - Extended height for better visual impact */}
      <div className="relative min-h-[700px] flex items-center bg-gradient-to-br from-primary via-primary/90 to-secondary overflow-hidden">
        {/* Abstract geometric shapes or overlay could go here */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1563477709790-27c59ddaa002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBzdHVkeWluZyUyMGFicm9hZHxlbnwxfHx8fDE3NjM2NTQ2NDZ8MA&ixlib=rb-4.1.0&q=80&w=1920"
            alt="Études à l'étranger background"
            className="w-full h-full object-cover"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
        </div>

        <Container className="relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <FadeIn delay={100}>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8 shadow-lg">
                  <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
                  <span className="text-white font-medium text-sm tracking-wide">Votre Avenir Commence Ici</span>
                </div>
              </FadeIn>

              <FadeIn delay={200}>
                <h1 className="text-white mb-6 font-heading font-bold leading-tight">
                  Réalisez Vos Rêves <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
                    d'Études à l'Étranger
                  </span>
                </h1>
              </FadeIn>

              <FadeIn delay={300}>
                <p className="text-white/90 text-xl mb-10 max-w-2xl leading-relaxed text-balance">
                  OMEGA24 CONSULTING vous accompagne dans toutes leurs démarches : orientation, admission, visa, logement et bien plus encore.
                </p>
              </FadeIn>

              <FadeIn delay={400} className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => scrollToSection('services')}
                  className="bg-secondary hover:bg-secondary/90 text-white text-lg px-8 py-6 rounded-lg shadow-xl shadow-secondary/20 hover:shadow-2xl hover:-translate-y-1 transition-all"
                  size="lg"
                >
                  Découvrir nos services
                </Button>
                <Button
                  onClick={() => scrollToSection('contact')}
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-primary text-lg px-8 py-6 rounded-lg shadow-lg hover:-translate-y-1 transition-all"
                  size="lg"
                >
                  Nous Contacter
                </Button>
              </FadeIn>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <FadeIn delay={500}>
                <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg bg-transparent">
                  {/* Logo with Glow */}
                  <div className="relative group z-10">
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#4DA6FF]/30 to-[#002F6C]/30 rounded-full blur-2xl opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/20 p-12 rounded-full shadow-2xl">
                      <img
                        src={logoImage}
                        alt="OMEGA24 CONSULTING"
                        className="w-56 h-56 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain animate-float drop-shadow-2xl"
                      />
                    </div>
                  </div>

                  {/* Inner Circles */}
                  <OrbitingCircles
                    className="size-[30px] border-none bg-transparent"
                    duration={20}
                    delay={20}
                    radius={190}
                  >
                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">
                      <GraduationCap className="text-secondary w-6 h-6" />
                    </div>
                  </OrbitingCircles>
                  <OrbitingCircles
                    className="size-[30px] border-none bg-transparent"
                    duration={20}
                    delay={10}
                    radius={190}
                  >
                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">
                      <Globe className="text-white w-6 h-6" />
                    </div>
                  </OrbitingCircles>

                  {/* Outer Circles (Reverse) */}
                  <OrbitingCircles
                    className="size-[50px] border-none bg-transparent"
                    radius={280}
                    duration={30}
                    reverse
                  >
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20">
                      <Award className="text-secondary w-8 h-8" />
                    </div>
                  </OrbitingCircles>
                  <OrbitingCircles
                    className="size-[50px] border-none bg-transparent"
                    radius={280}
                    duration={30}
                    delay={15}
                    reverse
                  >
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20">
                      <Users className="text-white w-8 h-8" />
                    </div>
                  </OrbitingCircles>
                </div>
              </FadeIn>
            </div>
          </div>
        </Container>

        {/* Decorative wave or curve at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      {/* Stats Section - Floating Overlap */}
      <Container className="relative z-20 -mt-20 mb-20">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={100} delay={500}>
          {[
            { icon: Globe, value: "50+", label: "Pays Partenaires" },
            { icon: Users, value: "1000+", label: "Étudiants Accompagnés" },
            { icon: GraduationCap, value: "200+", label: "Universités Partenaires" },
            { icon: Award, value: "95%", label: "Taux de Réussite" }
          ].map((stat, i) => (
            <FadeIn key={i} className="h-full">
              <div
                className="bg-card text-card-foreground p-6 rounded-xl shadow-lg border hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center group h-full"
              >
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
