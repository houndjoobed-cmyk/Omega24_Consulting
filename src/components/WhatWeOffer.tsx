import { GraduationCap, Briefcase, Plane, Shield, Home, Calculator } from 'lucide-react';

export function WhatWeOffer() {
  const offers = [
    {
      icon: GraduationCap,
      title: 'Accompagnement aux Études - DREAM VOYAGE',
      description: 'Nous vous accompagnons dans vos projets d\'études à l\'extérieur. Un meilleur choix pour un meilleur avenir.',
      countries: ['Canada', 'États-Unis', 'France', 'Belgique', 'Russie', 'Brésil', 'Luxembourg', 'Turquie', 'Allemagne', 'Roumanie', 'Irlande'],
      features: [
        'Visa étude',
        'Demande d\'admission',
        'Garantie financière',
        'Assistance logement',
        'Assistance conseils'
      ],
      color: '#4DA6FF'
    },
    {
      icon: Briefcase,
      title: 'Recherche de Contrat de Travail',
      description: 'Accompagnement pour trouver un contrat de travail dans 9 pays',
      countries: ['Allemagne', 'Suède', 'Pologne', 'Slovaquie', 'République Tchèque', 'Roumanie', 'Serbie', 'Canada', 'Bulgarie'],
      color: '#002F6C'
    },
    {
      icon: Plane,
      title: 'Billeterie',
      description: 'Service de réservation et vente de billets d\'avion avec les meilleures compagnies',
      features: ['Tarifs compétitifs', 'Compagnies internationales', 'Offres en OR'],
      color: '#4DA6FF'
    },
    {
      icon: Shield,
      title: 'Assurance',
      description: 'Tous types d\'assurances pour vous protéger et sécuriser votre avenir',
      features: ['Assurance Santé & Vie', 'Assurance Voyage', 'Assurance Auto et Moto', 'Assurance Habitation','Assurance Tous Risques'],
      color: '#002F6C'
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
      color: '#4DA6FF'
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
      color: '#002F6C'
    }
  ];

  return (
    <section id="cequenoousproposons" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-block bg-[#4DA6FF]/10 px-4 py-2 rounded-full mb-4">
            <span className="text-[#4DA6FF]">Notre Expertise</span>
          </div>
          <h2 className="text-[#002F6C] mb-4">
            Ce Que Nous Proposons
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            OMEGA24 CONSULTING vous offre une gamme complète de services pour 
            accompagner tous vos projets personnels et professionnels.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, index) => {
            const Icon = offer.icon;
            return (
              <div
                key={index}
                className="bg-[#F4F4F4] rounded-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center mb-6"
                  style={{ backgroundColor: offer.color }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-[#002F6C] mb-3">
                  {offer.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {offer.description}
                </p>

                {offer.countries && (
                  <div className="mt-4">
                    <p className="text-sm text-[#4DA6FF] mb-2">
                      Pays disponibles :
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {offer.countries.map((country, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-white px-3 py-1 rounded-full text-gray-700"
                        >
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {offer.features && (
                  <ul className="mt-4 space-y-2">
                    {offer.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#4DA6FF] mt-1">▸</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-[#002F6C] to-[#4DA6FF] rounded-2xl p-12 text-center text-white">
          <h3 className="mb-4">
            Besoin d'un Service Personnalisé ?
          </h3>
          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
            Contactez-nous pour discuter de votre projet et découvrir comment 
            nous pouvons vous accompagner dans sa réalisation.
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white text-[#002F6C] px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Nous Contacter
          </button>
        </div>
      </div>
    </section>
  );
}