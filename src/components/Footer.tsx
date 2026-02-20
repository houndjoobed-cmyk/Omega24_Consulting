import logoImage from '@/assets/Log Oméga24 BLANC B.png';
import { Facebook, Linkedin, Instagram, Mail, Phone, Lock, LogOut, CheckCheck } from 'lucide-react';
import { useState, useCallback, memo } from 'react';
import { AdminLogin } from './AdminLogin';
import { useAuth } from '../contexts/AuthContext';
import { MentionsLegales } from './MentionsLegales';
import { PolitiqueConfidentialite } from './PolitiqueConfidentialite';
import { CGV } from './CGV';
import { Container } from './ui/Container';

// Composant pays mémorisé pour éviter les re-rendus
const CountryCard = memo(function CountryCard({ name, flag }: { name: string; flag: string }) {
  return (
    <div className="text-center group cursor-pointer min-w-[100px]">
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 group-hover:border-secondary/50 group-hover:bg-white/10 transition-all duration-300 group-hover:-translate-y-1">
        <div
          className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
        >
          {flag}
        </div>
        <p className="text-xs text-primary-foreground/90 group-hover:text-secondary transition-colors truncate font-medium">
          {name}
        </p>
      </div>
    </div>
  );
});

// Données des pays
const COUNTRIES = [
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'États-Unis', flag: '🇺🇸' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Belgique', flag: '🇧🇪' },
  { name: 'Russie', flag: '🇷🇺' },
  { name: 'Brésil', flag: '🇧🇷' },
  { name: 'Luxembourg', flag: '🇱🇺' },
  { name: 'Turquie', flag: '🇹🇷' },
  { name: 'Allemagne', flag: '🇩🇪' },
  { name: 'Roumanie', flag: '🇷🇴' },
  { name: 'Irlande', flag: '🇮🇪' },
  { name: 'Suède', flag: '🇸🇪' },
  { name: 'Pologne', flag: '🇵🇱' },
  { name: 'Slovaquie', flag: '🇸🇰' },
  { name: 'République Tchèque', flag: '🇨🇿' },
  { name: 'Serbie', flag: '🇷🇸' },
  { name: 'Bulgarie', flag: '🇧🇬' }
] as const;

export function Footer() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showMentionsLegales, setShowMentionsLegales] = useState(false);
  const [showPolitique, setShowPolitique] = useState(false);
  const [showCGV, setShowCGV] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = useCallback(() => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
    }
  }, [logout]);

  const openAdminLogin = useCallback(() => setShowAdminLogin(true), []);
  const closeAdminLogin = useCallback(() => setShowAdminLogin(false), []);
  const openMentionsLegales = useCallback(() => setShowMentionsLegales(true), []);
  const closeMentionsLegales = useCallback(() => setShowMentionsLegales(false), []);
  const openPolitique = useCallback(() => setShowPolitique(true), []);
  const closePolitique = useCallback(() => setShowPolitique(false), []);
  const openCGV = useCallback(() => setShowCGV(true), []);
  const closeCGV = useCallback(() => setShowCGV(false), []);

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Countries Flags Section */}
      <div className="py-12">
        <Container>
          <div className="text-center mb-8">
            <h4 className="font-heading text-2xl font-bold mb-2 text-white">Nous Opérons Dans Ces Pays</h4>
            <p className="text-primary-foreground/70">Une présence internationale pour mieux vous servir</p>
          </div>

          <div className="relative">
            {/* Gradient fade masks for scroll indication could be added here */}
            <div
              className="scrollbar-hide flex gap-4 overflow-x-auto pb-4 snap-x"
            >
              {COUNTRIES.map((country, index) => (
                <CountryCard key={index} name={country.name} flag={country.flag} />
              ))}
            </div>
          </div>
        </Container>
      </div>

      <div className="bg-black/20">
        <Container className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-6">
              <img
                src={logoImage}
                alt="Omega24 Consulting"
                className="h-16 w-auto"
              />
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                Votre partenaire de confiance pour réaliser vos rêves d'études à l'étranger et sécuriser votre avenir.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61561081688272&locale=fr_FR" },
                  { icon: Instagram, href: "https://www.instagram.com/omega24consulting/" },
                  { icon: Linkedin, href: "https://www.linkedin.com/company/omega24-consulting/" },
                  { icon: Mail, href: "mailto:infos@omega24consulting.com" }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 hover:bg-secondary hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-heading text-lg font-semibold mb-6 text-white">Liens Rapides</h4>
              <ul className="space-y-3 text-sm">
                {['Accueil', 'Ce Que Nous Proposons', 'Nos Services', 'À Propos', 'Contact'].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, '')}`}
                      className="text-primary-foreground/70 hover:text-secondary hover:pl-2 transition-all inline-flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary/50"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-heading text-lg font-semibold mb-6 text-white">Nos Domaines</h4>
              <ul className="space-y-3 text-sm">
                {[
                  'Accompagnement aux Études',
                  'Contrats de Travail',
                  'Billeterie Aérienne',
                  'Assurances',
                  'Gestion Locative',
                  'Comptabilité'
                ].map((item) => (
                  <li key={item} className="text-primary-foreground/70 flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 text-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-heading text-lg font-semibold mb-6 text-white">Contact</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary transition-colors">
                    <Phone className="w-4 h-4 text-secondary group-hover:text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white mb-1">Téléphone</p>
                    <span className="text-primary-foreground/70 block">+229 01 41 31 22 22</span>
                    <span className="text-primary-foreground/70">+229 01 90 57 42 42</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary transition-colors">
                    <Mail className="w-4 h-4 text-secondary group-hover:text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white mb-1">Email</p>
                    <span className="text-primary-foreground/70 break-all">
                      infos@omega24consulting.com
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-sm text-primary-foreground/50">
                © {new Date().getFullYear()} Omega24 Consulting. Tous droits réservés.
              </p>

              {/* Admin & Legal */}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <button onClick={openMentionsLegales} className="text-primary-foreground/50 hover:text-secondary transition-colors">Mentions Légales</button>
                <button onClick={openPolitique} className="text-primary-foreground/50 hover:text-secondary transition-colors">Politique de Confidentialité</button>
                <button onClick={openCGV} className="text-primary-foreground/50 hover:text-secondary transition-colors">CGV</button>

                <div className="w-px h-4 bg-white/20 hidden md:block"></div>

                {isAuthenticated ? (
                  <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </button>
                ) : (
                  <button onClick={openAdminLogin} className="text-primary-foreground/50 hover:text-secondary transition-colors flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Admin
                  </button>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>


      {/* Modals */}
      {showAdminLogin && <AdminLogin onClose={closeAdminLogin} />}
      {showMentionsLegales && <MentionsLegales onClose={closeMentionsLegales} />}
      {showPolitique && <PolitiqueConfidentialite onClose={closePolitique} />}
      {showCGV && <CGV onClose={closeCGV} />}
    </footer >
  );
}