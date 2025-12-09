import { useState, lazy, Suspense, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import assuranceFlyer from './assets/68477f6f95a84425423fe12251a74d2fd17f1ce2.png';
import billetterieFlyer from './assets/c57cb368d0fcbe717e89feafe155bc280d522dc2.png';
import locationFlyer from './assets/1ea55cc09f74c36daa5ac5718db259bf90a61dae.png';

// Lazy loading des composants moins critiques pour un chargement initial plus rapide
const WhatWeOffer = lazy(() => import('./components/WhatWeOffer').then(module => ({ default: module.WhatWeOffer })));
const Services = lazy(() => import('./components/Services').then(module => ({ default: module.Services })));
const Testimonials = lazy(() => import('./components/Testimonials').then(module => ({ default: module.Testimonials })));
const About = lazy(() => import('./components/About').then(module => ({ default: module.About })));
const Contact = lazy(() => import('./components/Contact').then(module => ({ default: module.Contact })));
const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));

export interface Flyer {
  id: string;
  title: string;
  description: string;
  image: string;
  details?: string[];
}

// Composant de chargement optimisé
function LoadingFallback({ height = "400px" }: { height?: string }) {
  return (
    <div
      className="flex items-center justify-center bg-gray-50 animate-pulse"
      style={{ minHeight: height }}
    >
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#4DA6FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm">Chargement...</p>
      </div>
    </div>
  );
}

export default function App() {
  const [flyers, setFlyers] = useState<Flyer[]>([]);

  // État pour le chargement progressif
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Marquer comme hydraté après le premier rendu
    setIsHydrated(true);

    // Précharger les composants critiques après le chargement initial
    const preloadComponents = async () => {
      // Attendre un peu pour ne pas bloquer le rendu initial
      await new Promise(resolve => setTimeout(resolve, 100));

      // Précharger les composants suivants
      import('./components/WhatWeOffer');
      import('./components/Services');
    };

    preloadComponents();
  }, []);

  const handleUpdateFlyers = (newFlyers: Flyer[]) => {
    setFlyers(newFlyers);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        {/* Header et Hero sont chargés immédiatement (critiques) */}
        <Header />
        <Hero />

        {/* Lazy loading des autres sections */}
        {isHydrated && (
          <>
            <Suspense fallback={<LoadingFallback height="300px" />}>
              <WhatWeOffer />
            </Suspense>

            <Suspense fallback={<LoadingFallback height="600px" />}>
              <Services flyers={flyers} onUpdateFlyers={handleUpdateFlyers} />
            </Suspense>

            <Suspense fallback={<LoadingFallback height="500px" />}>
              <Testimonials />
            </Suspense>

            <Suspense fallback={<LoadingFallback height="400px" />}>
              <About />
            </Suspense>

            <Suspense fallback={<LoadingFallback height="500px" />}>
              <Contact />
            </Suspense>

            <Suspense fallback={<LoadingFallback height="400px" />}>
              <Footer />
            </Suspense>
          </>
        )}
      </div>
    </AuthProvider>
  );
}