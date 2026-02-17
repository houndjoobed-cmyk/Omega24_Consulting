import { Target, Users, Globe, Shield, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Container } from './ui/Container';
import { Card, CardContent } from './ui/card';
import { FadeIn, StaggerContainer } from './ui/motion';

export function About() {
  return (
    <section id="apropos" className="py-24 bg-muted/30">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left Content */}
          <div className="">
            <FadeIn>
              <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-6">
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">À Propos de Nous</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6 leading-tight">
                Votre Partenaire de Confiance pour <span className="text-primary">l'International</span>
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                OMEGA24 CONSULTING est une agence spécialisée dans l'accompagnement
                des étudiants et professionnels qui souhaitent poursuivre leurs projets à l'étranger.
              </p>
              <p className="text-muted-foreground mb-10 leading-relaxed">
                Nous guidons les jeunes dans toutes leurs démarches : de la définition
                du projet d'études jusqu'à l'installation dans le pays d'accueil, en
                passant par les admissions, le visa, le logement et bien plus encore.
              </p>
            </FadeIn>

            {/* Features Grid */}
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-8" delay={200}>
              {[
                { icon: Target, title: "Notre Mission", desc: "Faciliter l'accès aux opportunités internationales" },
                { icon: Users, title: "Notre Équipe", desc: "Conseillers experts en mobilité internationale" },
                { icon: Globe, title: "Réseau Mondial", desc: "Partenaires dans plus de 50 pays" },
                { icon: Shield, title: "Accompagnement", desc: "Suivi personnalisé de A à Z" }
              ].map((feature, i) => (
                <FadeIn key={i} className="flex gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-snug">
                      {feature.desc}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </StaggerContainer>
          </div>

          {/* Right Image */}
          <FadeIn className="relative" delay={200}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.1.0&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                alt="Étudiants OMEGA 24 CONSULTING"
                className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10"></div>

            {/* Floating Badge */}
            <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg max-w-[200px] border border-white/50">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-green-500 fill-green-500/20" />
                <span className="font-bold text-sm">Certifié & Reconnu</span>
              </div>
              <p className="text-xs text-muted-foreground">Expertise validée par nos partenaires.</p>
            </div>
          </FadeIn>
        </div>

        {/* Why Choose Us */}
        <div className="relative">
          <div className="text-center mb-12">
            <FadeIn>
              <h3 className="text-3xl font-heading font-bold text-foreground">
                Pourquoi Choisir OMEGA24 ?
              </h3>
            </FadeIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={100} delay={200}>
            {[
              { emoji: "🎓", title: "Accompagnement Complet", desc: "De la définition de votre projet jusqu'à votre installation, nous sommes à vos côtés." },
              { emoji: "💼", title: "Expertise Avérée", desc: "Une équipe qui maîtrise parfaitement les systèmes éducatifs et administratifs internationaux." },
              { emoji: "🌍", title: "Réseau Mondial", desc: "Des partenariats solides avec plus de 200 institutions à travers le monde." }
            ].map((item, i) => (
              <FadeIn key={i} className="h-full">
                <Card className="text-center border-none shadow-md bg-card h-full">
                  <CardContent className="p-8">
                    <div className="text-6xl mb-6 transform hover:scale-110 transition-transform cursor-default">{item.emoji}</div>
                    <h4 className="text-xl font-bold text-foreground mb-4">{item.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </Container>
    </section>
  );
}