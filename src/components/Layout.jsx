import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import CustomCursor from './CustomCursor';

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  
  // Cache DOM measurements to avoid layout thrashing
  const heroHeightRef = useRef(0);
  const docHeightRef = useRef(0);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Memoized menu items
  const menuItems = useMemo(() => [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ], []);

  // Cache section elements
  const sectionsRef = useRef(null);

  // Show header after scrolling past hero section + track scroll progress
  useEffect(() => {
    // Cache DOM measurements on mount/resize
    const updateMeasurements = () => {
      heroHeightRef.current = window.innerHeight * 0.5;
      docHeightRef.current = document.documentElement.scrollHeight - window.innerHeight;
      sectionsRef.current = ['work', 'about', 'contact'].map(id => document.getElementById(id));
    };

    updateMeasurements();
    window.addEventListener('resize', updateMeasurements, { passive: true });

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        
        setHeaderVisible(scrollY > heroHeightRef.current);
        setShowBackToTop(scrollY > window.innerHeight);
        
        if (docHeightRef.current > 0) {
          setScrollProgress((scrollY / docHeightRef.current) * 100);
        }

        // Detect active section using cached elements
        if (sectionsRef.current) {
          const viewportMiddle = window.innerHeight / 2;
          for (let i = 0; i < sectionsRef.current.length; i++) {
            const el = sectionsRef.current[i];
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
                setActiveSection(menuItems[i].href.slice(1));
                break;
              }
            }
          }
        }
        
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateMeasurements);
    };
  }, [menuItems]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Toggle mobile menu with callback
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Custom Cursor - Desktop only */}
      <div className="hidden md:block">
        <CustomCursor />
      </div>

      {/* Header - Hidden in hero, appears on scroll */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: headerVisible ? 0 : -100 }}
        transition={{ duration: 0.4, ease: 'linear' }}
        className="fixed left-0 right-0 top-0 z-50 hidden md:block will-change-transform"
        style={{ willChange: 'transform' }}
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-black/80 px-12 py-4 backdrop-blur-xl">
          {/* Logo */}
          <a href="/" className="group flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-white/60 transition-colors group-hover:text-white">
              vikvisuals
            </span>
          </a>

          {/* Nav Items */}
          <nav className="flex items-center gap-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group relative text-xs uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu Button */}
      <motion.button
        className="fixed right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/80 backdrop-blur-sm md:hidden will-change-transform"
        onClick={toggleMobileMenu}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle menu"
      >
        <div className="flex flex-col gap-1.5">
          <motion.span
            className="block h-0.5 w-5 bg-white origin-center"
            animate={mobileMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="block h-0.5 w-5 bg-white"
            animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
          />
          <motion.span
            className="block h-0.5 w-5 bg-white origin-center"
            animate={mobileMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
          />
        </div>
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at calc(100% - 42px) 42px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 42px) 42px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 42px) 42px)' }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-40 bg-black md:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-8">
              {menuItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="text-[15vw] font-black uppercase leading-none tracking-tighter text-white/20 transition-colors hover:text-white will-change-transform"
                  style={{
                    WebkitTextStroke: '1px rgba(255,255,255,0.3)',
                    WebkitTextFillColor: 'transparent',
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, ease: 'linear' }}
                  whileHover={{
                    WebkitTextFillColor: 'white',
                  }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Logo - Fixed Corner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed left-6 top-6 z-30 md:hidden"
      >
        <a href="/" className="group flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 transition-colors group-hover:text-white">
            vikvisuals
          </span>
        </a>
      </motion.div>

      {/* Main Content */}
      <main>{children}</main>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed left-0 top-0 z-[60] h-[2px] bg-accent"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Section Navigation Dots - Desktop */}
      <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 md:flex">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="group relative flex items-center justify-end"
            aria-label={`Go to ${item.label}`}
          >
            <span className="absolute right-6 text-[10px] uppercase tracking-widest text-white/0 transition-all duration-300 group-hover:right-8 group-hover:text-white/50">
              {item.label}
            </span>
            <span
              className={`h-2 w-2 rounded-full border transition-all duration-300 ${
                activeSection === item.href.slice(1)
                  ? 'border-accent bg-accent scale-125'
                  : 'border-white/30 bg-transparent group-hover:border-white group-hover:scale-110'
              }`}
            />
          </a>
        ))}
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/80 backdrop-blur-sm transition-all hover:border-accent hover:bg-black md:bottom-8 md:right-8"
            aria-label="Back to top"
          >
            <svg
              className="h-5 w-5 text-white/60 transition-colors group-hover:text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Fixed Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 left-6 z-30 hidden text-[10px] uppercase tracking-[0.3em] text-white/30 md:block md:left-12"
      >
      </motion.div>
    </div>
  );
}
