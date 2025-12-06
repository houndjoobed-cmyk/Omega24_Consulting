import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WhatWeOffer } from './components/WhatWeOffer';
import { Services } from './components/Services';
import { Testimonials } from './components/Testimonials';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import assuranceFlyer from 'figma:asset/68477f6f95a84425423fe12251a74d2fd17f1ce2.png';
import billetterieFlyer from 'figma:asset/c57cb368d0fcbe717e89feafe155bc280d522dc2.png';
import locationFlyer from 'figma:asset/1ea55cc09f74c36daa5ac5718db259bf90a61dae.png';

export interface Flyer {
  id: string;
  title: string;
  description: string;
  image: string;
  details?: string[];
}

export default function App() {
  const [flyers, setFlyers] = useState<Flyer[]>([
    {
      id: '1',
      title: 'Services d\'Assurance',
      description: 'OMEGA24 CONSULTING, votre partenaire de proximité pour tous vos besoins en assurance. Nous vous offrons une gamme complète de services d\'assurance adaptés à vos besoins.',
      image: assuranceFlyer,
      details: [
        'Assurance Santé & Vie - Protection complète pour vous et votre famille',
        'Assurance Voyage - Voyagez en toute sérénité',
        'Assurance Auto et Moto - Couverture optimale pour vos véhicules',
        'Assurance Multirisque Habitation - Protégez votre logement',
        'Assurance à Responsabilité Civile Scolaire - Sécurité pour vos enfants'
      ]
    },
    {
      id: '2',
      title: 'Service de Billeterie',
      description: 'Vous avez le visa mais le billet est cher pour vous ? Ne vous en faites pas pour votre billet. Nous avons des offres en OR avec les meilleures compagnies aériennes.',
      image: billetterieFlyer,
      details: [
        'Tarifs compétitifs avec offres spéciales en OR',
        'Congo Airways - Vols vers l\'Afrique Centrale',
        'Qatar Airways - Connexions mondiales',
        'Ethiopian Airlines - Premier transporteur africain',
        'Brussels Airlines - Vols vers l\'Europe',
        'South African Airways - Réseau africain',
        'Singapore Airlines - Excellence asiatique',
        'Air France - Compagnie française de référence',
        'Turkish Airlines - Hub entre Europe et Asie',
        'Kenya Airways - The Pride of Africa',
        'Fly CAA - Vols régionaux'
      ]
    },
    {
      id: '3',
      title: 'Où Sommes-Nous',
      description: 'Retrouvez-nous facilement à notre siège social à Gbèdjromèdé. L\'adresse du meilleur choix pour un avenir meilleur.',
      image: locationFlyer,
      details: [
        'Adresse : Gbèdjromèdé 2ème von à droite en quittant le carrefour 16 ampoules en allant vers le carrefour "Vodafone"',
        'Points de repère : Entre Carrefour Vodafone, Carrefour 16 ampoules, et Carrefour St Michel',
        'Téléphone : +229 01 41 312 222 / 01 90 574 242',
        'Email : omega24consulting@gmail.com',
        'Horaires : Lun-Ven 9h-18h, Sam 10h-16h'
      ]
    }
  ]);

  const handleUpdateFlyers = (newFlyers: Flyer[]) => {
    setFlyers(newFlyers);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <Hero />
        <WhatWeOffer />
        <Services flyers={flyers} onUpdateFlyers={handleUpdateFlyers} />
        <Testimonials />
        <About />
        <Contact />
        <Footer />
      </div>
    </AuthProvider>
  );
}