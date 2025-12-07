import image_a3e94e1254122a1ce127e1521b608a1d24b5d21a from 'figma:asset/a3e94e1254122a1ce127e1521b608a1d24b5d21a.png';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, Shield, Lock, User, LogOut } from 'lucide-react';
import logoImage from 'figma:asset/a3e94e1254122a1ce127e1521b608a1d24b5d21a.png';
import { useState } from 'react';
import { AdminLogin } from './AdminLogin';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { MentionsLegales } from './MentionsLegales';
import { PolitiqueConfidentialite } from './PolitiqueConfidentialite';
import { CGV } from './CGV';

export function Footer() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showMentionsLegales, setShowMentionsLegales] = useState(false);
  const [showPolitique, setShowPolitique] = useState(false);
  const [showCGV, setShowCGV] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
    }
  };

  const countries = [
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
  ];

  return (
    <footer className="bg-[#002F6C] text-white">
      {/* Countries Flags Section */}
      <div className="bg-[#001F4D] py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <h4 className="text-center mb-2">Nous Opérons Dans Ces Pays</h4>
          <p className="text-center text-white/70 text-sm">Une présence internationale pour mieux vous servir</p>
        </div>
        <div className="relative">
          {/* Scrolling Animation */}
          <div className="flex animate-scroll gap-8">
            {/* First Set */}
            {countries.map((country, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 text-center group cursor-pointer"
                style={{ minWidth: '120px' }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 group-hover:border-[#4DA6FF] group-hover:bg-white/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                  <div className="text-7xl mb-3 transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
                    {country.flag}
                  </div>
                  <p className="text-xs text-white/90 group-hover:text-[#4DA6FF] transition-colors">
                    {country.name}
                  </p>
                </div>
              </div>
            ))}
            {/* Duplicate Set for Seamless Loop */}
            {countries.map((country, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 text-center group cursor-pointer"
                style={{ minWidth: '120px' }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 group-hover:border-[#4DA6FF] group-hover:bg-white/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                  <div className="text-7xl mb-3 transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
                    {country.flag}
                  </div>
                  <p className="text-xs text-white/90 group-hover:text-[#4DA6FF] transition-colors">
                    {country.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <img
              src={image_a3e94e1254122a1ce127e1521b608a1d24b5d21a}
              alt="OMEGA24 CONSULTING"
              className="h-16 w-auto mb-4"
            />
            <p className="text-white/80 text-sm mb-4">
              Votre partenaire pour réaliser vos rêves d'études à l'étranger.
            </p>
            <div className="flex space-x-3">
              <a href="https://www.facebook.com/profile.php?id=61561081688272&locale=fr_FR" className="w-8 h-8 bg-white/10 hover:bg-[#4DA6FF] rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="mailto:omega24consulting@gmail.com" className="w-8 h-8 bg-white/10 hover:bg-[#4DA6FF] rounded-full flex items-center justify-center transition-colors">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-[#4DA6FF] rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-[#4DA6FF] rounded-full flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Liens Rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#accueil" className="text-white/80 hover:text-[#4DA6FF] transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#cequenoousproposons" className="text-white/80 hover:text-[#4DA6FF] transition-colors">
                  Ce que nous proposons
                </a>
              </li>
              <li>
                <a href="#services" className="text-white/80 hover:text-[#4DA6FF] transition-colors">
                  Nos Services
                </a>
              </li>
              <li>
                <a href="#apropos" className="text-white/80 hover:text-[#4DA6FF] transition-colors">
                  À Propos
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white/80 hover:text-[#4DA6FF] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4">Nos Domaines</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-white/80">Accompagnement aux Études</li>
              <li className="text-white/80">Contrats de Travail</li>
              <li className="text-white/80">Billeterie Aérienne</li>
              <li className="text-white/80">Assurances</li>
              <li className="text-white/80">Gestion Locative</li>
              <li className="text-white/80">Comptabilité</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#4DA6FF]" />
                <div>
                  <span className="text-white/80">+229 01 41 31 22 22</span>
                  <br />
                  <span className="text-white/80">+229 01 90 57 42 42</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#4DA6FF]" />
                <span className="text-white/80 break-all">
                  omega24consulting@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Admin Section */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {isAuthenticated ? (
              <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
                  <div className="w-10 h-10 bg-[#4DA6FF] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-white/60">Connecté en tant que</p>
                    <p className="text-white">
                      {user?.email || 'Administrateur'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-red-500 hover:border-red-500 hover:text-white bg-[rgb(249,9,9)]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowAdminLogin(true)}
                className="bg-white/10 hover:bg-[#4DA6FF] text-white border border-white/20 backdrop-blur-sm"
              >
                <Lock className="w-4 h-4 mr-2" />
                Espace Administrateur
              </Button>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <p>© {new Date().getFullYear()} OMEGA24 CONSULTING. Tous droits réservés.</p>
            <div className="flex gap-6">
              <button
                className="hover:text-[#4DA6FF] transition-colors"
                onClick={(e) => { e.preventDefault(); setShowMentionsLegales(true); }}
              >
                Mentions Légales
              </button>
              <button
                className="hover:text-[#4DA6FF] transition-colors"
                onClick={(e) => { e.preventDefault(); setShowPolitique(true); }}
              >
                Politique de Confidentialité
              </button>
              <button
                className="hover:text-[#4DA6FF] transition-colors"
                onClick={(e) => { e.preventDefault(); setShowCGV(true); }}
              >
                CGV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      )}

      {/* Mentions Legales Modal */}
      {showMentionsLegales && (
        <MentionsLegales onClose={() => setShowMentionsLegales(false)} />
      )}

      {/* Politique Confidentialite Modal */}
      {showPolitique && (
        <PolitiqueConfidentialite onClose={() => setShowPolitique(false)} />
      )}

      {/* CGV Modal */}
      {showCGV && (
        <CGV onClose={() => setShowCGV(false)} />
      )}
    </footer>
  );
}