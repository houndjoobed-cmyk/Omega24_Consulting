import { GraduationCap, Briefcase, Plane, Shield, Home, Calculator, Check } from 'lucide-react';
import { Container } from './ui/Container';
import { cn } from './ui/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

export function WhatWeOffer() {
  const offers = [
    {
      icon: GraduationCap,
      title: 'Accompagnement aux Études',
      description: 'Nous vous accompagnons dans vos projets d\'études à l\'extérieur. Le meilleur choix pour un meilleur avenir.',
      countries: ['Canada', 'États-Unis', 'France', 'Belgique', 'Russie', 'Brésil', 'Luxembourg', 'Turquie', 'Allemagne', 'Roumanie', 'Irlande'],
      features: [
        'Visa étude',
        'Demande d\'admission',
        'Garantie financière',
        'Assistance logement',
        'Assistance conseils',
        'AVI'

      ],
      color: 'bg-primary'
    },
    {
      icon: Briefcase,
      title: 'Recherche de Contrat de Travail',
      description: 'Accompagnement pour trouver un contrat de travail dans plus de 13 pays',
      countries: ['Allemagne', 'Suède', 'Pologne', 'Slovaquie', 'République Tchèque', 'Roumanie', 'Serbie', 'Canada', 'Bulgarie', 'Qatar', 'Hongrie', 'Biélorussie', 'Ukraine'],
      color: 'bg-secondary'
    },
    {
      icon: Plane,
      title: 'Billeterie',
      description: 'Service de réservation et vente de billets d\'avion avec les meilleures compagnies',
      features: ['Tarifs compétitifs', 'Compagnies internationales', 'Offres en OR'],
      color: 'bg-primary'
    },
    {
      icon: Shield,
      title: 'Assurance',
      description: 'Tous types d\'assurances pour vous protéger et sécuriser votre avenir',
      features: ['Assurance Santé & Vie', 'Assurance Voyage', 'Assurance Auto et Moto', 'Assurance Habitation', 'Assurance Tous Risques'],
      color: 'bg-secondary'
    },
    {
      icon: Home,
      title: 'Gestion Locative',
      description: 'Gestion professionnelle de vos biens immobiliers et transactions foncières',
      features: [
        'Gestion Locative',
        'Vente, Achat de parcelle',
        'Mutation des Noms',
        'Gestion Guest House',
        'Titre Foncier',
        'Vérification des parcelles auprès de l\'IGN',
        'Recouvrement des créances'
      ],
      color: 'bg-primary'
    },
    {
      icon: Calculator,
      title: 'Comptabilité',
      description: 'Services comptables, fiscaux et administratifs pour particuliers et entreprises',
      features: [
        'Gestionnaire Administratif & Financier',
        'Fiscaliste',
        'Comptable',
        'Création d\'entreprise en ligne',
        'Création de compte e-service',
        'Déclaration fiscale',
        'Attestation fiscale, Non faillite, CNSS',
        'Tenu de la comptabilité & Externalisation'
      ],
      color: 'bg-secondary'
    }
  ];

  return (
    <section id="cequenoousproposons" className="py-24 bg-background">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Notre Expertise</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Ce Que Nous Proposons
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Oméga24 Consulting vous offre une gamme complète de services pour
            accompagner tous vos projets personnels et professionnels.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, index) => {
            const Icon = offer.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-muted"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div
                    className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-6", offer.color)}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">{offer.title}</CardTitle>
                  <CardDescription>{offer.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  {offer.countries && (
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                        Pays disponibles
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {offer.countries.map((country, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-muted px-2 py-1 rounded-sm text-muted-foreground border border-muted-foreground/10"
                          >
                            {country}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {offer.features && (
                    <ul className="space-y-2">
                      {offer.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                          <span className="text-primary mt-0.5"><Check className="w-4 h-4" /></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 px-6 py-16 text-center text-primary-foreground shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h3 className="text-3xl font-heading font-bold mb-6">
              Besoin d'un Service Personnalisé ?
            </h3>
            <p className="text-primary-foreground/90 text-lg mb-8 leading-relaxed">
              Contactez-nous pour discuter de votre projet et découvrir comment
              nous pouvons vous accompagner dans sa réalisation.
            </p>
            <button
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-primary font-bold px-8 py-4 rounded-lg hover:bg-secondary hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Nous Contacter
            </button>
          </div>
          {/* Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] mask-image-gradient-b"></div>
        </div>
      </Container>
    </section>
  );
}