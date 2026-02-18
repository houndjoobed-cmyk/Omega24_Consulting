import { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { Container } from './ui/Container';
import { Button } from './ui/button';
import { cn } from '@/components/ui/utils';
import PillNav from './ui/pill-nav';
import { motion, AnimatePresence } from 'framer-motion';

const menuVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "afterChildren"
    }
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      when: "afterChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Simple active section detecting
      const sections = ['accueil', 'cequenoousproposons', 'services', 'temoignages', 'apropos', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'accueil', href: '#accueil', label: 'Accueil' },
    { id: 'cequenoousproposons', href: '#cequenoousproposons', label: 'Offres' },
    { id: 'services', href: '#services', label: 'Services' },
    { id: 'temoignages', href: '#temoignages', label: 'Témoignages' },
    { id: 'apropos', href: '#apropos', label: 'À Propos' },
    { id: 'contact', href: '#contact', label: 'Contact' },
  ];

  const handleNavItemClick = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 85; // Adjust based on header height + padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300"
    >
      <div className={cn(
        "absolute inset-0 transition-all duration-500 bg-background/95 backdrop-blur-md border-b",
        isScrolled ? "shadow-sm border-border" : "border-transparent"
      )} />

      <Container className="relative">
        <div className="flex justify-center items-center min-h-[64px] relative">
          {/* Desktop Navigation with Pill Effect */}
          <div className="hidden md:block">
            <PillNav
              items={navLinks}
              activeId={activeSection}
              onItemClick={handleNavItemClick}
              className="bg-transparent border-none shadow-none"
            />
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden lg:block absolute right-0">
            <Button
              size="sm"
              className="bg-secondary hover:bg-secondary/90 text-white shadow-md hover:shadow-lg transition-all"
              onClick={() => handleNavItemClick('contact')}
            >
              Demander un Devis
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden absolute right-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-foreground hover:bg-slate-100 rounded-md transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              className="md:hidden absolute top-full left-0 right-0 bg-background border-b shadow-lg overflow-hidden"
            >
              <nav className="flex flex-col p-4 space-y-4">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.href}
                    variants={itemVariants}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 text-foreground hover:bg-slate-50 hover:text-primary rounded-md transition-colors font-medium block",
                      activeSection === link.id && "bg-slate-50 text-primary"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      handleNavItemClick(link.id);
                    }}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.div variants={itemVariants}>
                  <Button
                    className="w-full bg-secondary hover:bg-secondary/90 text-white mt-4"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleNavItemClick('contact');
                    }}
                  >
                    Demander un Devis
                  </Button>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}