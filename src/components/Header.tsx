import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logoImage from 'figma:asset/a3e94e1254122a1ce127e1521b608a1d24b5d21a.png';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#accueil', label: 'Accueil' },
    { href: '#cequenoousproposons', label: 'Ce Que Nous Proposons' },
    { href: '#services', label: 'Nos Services' },
    { href: '#temoignages', label: 'Témoignages' },
    { href: '#apropos', label: 'À Propos' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={logoImage}
              alt="OMEGA24 CONSULTING"
              className="h-30 w-auto animate-float"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#002F6C] hover:text-[#4DA6FF] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#002F6C]"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[#002F6C] hover:text-[#4DA6FF] transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}