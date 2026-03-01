import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useCallback, useMemo } from 'react';

export default function Hero() {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Memoized hover handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Memoized ticker array
  const tickerItems = useMemo(() => [...Array(6)], []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden"
    >
      {/* Noise Texture Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
      />

      {/* Main Content */}
      <motion.div
        style={{ opacity, willChange: 'opacity' }}
        className="relative z-10"
      >
        {/* Giant Brutalist Title - Centered, slightly higher */}
        <motion.div
          style={{ y: y1, scale, willChange: 'transform' }}
          className="relative will-change-transform flex flex-col items-center -mt-6 md:-mt-40"
        >
          <motion.h1
            initial={{ x: '-100%' }}
            animate={{ x: ['-100%', '0%', '0%'] }}
            transition={{ times: [0, 0.7, 1], duration: 2.2, ease: [0.7, 0.2, 0.1, 1] }}
            className="text-[10vw] sm:text-[12vw] md:text-[16vw] lg:text-[18vw] font-black font-sans leading-[0.85] tracking-tighter whitespace-nowrap select-none will-change-transform text-center"
            style={{ willChange: 'transform' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.span
              className="inline-block transition-all duration-500 hero-title-text"
              style={{
                WebkitTextStroke: isHovered ? '0px' : '2px rgba(255,255,255,0.6)',
                WebkitTextFillColor: isHovered ? 'white' : 'transparent',
              }}
            >
              VIK
            </motion.span>
          </motion.h1>

          <motion.h1
            initial={{ x: '100%' }}
            animate={{ x: ['100%', '0%', '0%'] }}
            transition={{ times: [0, 0.7, 1], duration: 2.2, delay: 0.1, ease: [0.7, 0.2, 0.1, 1] }}
            className="text-[10vw] sm:text-[12vw] md:text-[16vw] lg:text-[18vw] font-black font-sans leading-[0.85] tracking-tighter whitespace-nowrap select-none text-center will-change-transform"
            style={{ willChange: 'transform' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.span
              className="inline-block transition-all duration-500 hero-title-text"
              style={{
                WebkitTextStroke: isHovered ? '0px' : '2px rgba(255,255,255,0.6)',
                WebkitTextFillColor: isHovered ? 'white' : 'transparent',
              }}
            >
              VISUALS
            </motion.span>
                {/* Mobile only: überschreibe Outline für VIK VISUALS */}
                <style>{`
                  @media (max-width: 639px) {
                    .hero-title-text {
                      -webkit-text-stroke: 0px !important;
                      -webkit-text-fill-color: white !important;
                      text-stroke: 0px !important;
                      color: white !important;
                    }
                  }
                `}</style>
          </motion.h1>
        </motion.div>

        {/* Subtitle bar */}
        <motion.div
          style={{ y: y2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="relative mt-8 grid grid-cols-1 sm:flex sm:flex-row items-center justify-between px-4 sm:px-6 md:px-12 gap-y-3 sm:gap-0"
        >
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline h-px w-16 bg-white/20 mb-1 sm:mb-0" />
            <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.4em] text-white/40 font-sans">
              vikvisuals
            </span>
          </div>

          <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.4em] text-white/40 font-mono mt-1 sm:mt-0">
            Digital Art
          </span>

          <div className="flex items-center gap-4">
            <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.4em] text-white/40 mt-1 sm:mt-0">
              Since 2018
            </span>
            <span className="hidden sm:inline h-px w-16 bg-white/20 mt-1 sm:mt-0" />
          </div>
        </motion.div>

        {/* Skills Ticker */}
        <motion.div
          style={{ y: y3, willChange: 'transform' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-32 left-0 right-0 overflow-hidden will-change-transform"
        >
          <motion.div
            className="flex whitespace-nowrap will-change-transform"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ willChange: 'transform' }}
          >
            {tickerItems.map((_, i) => (
              <span
                key={i}
                className="mx-6 text-[4vw] sm:text-[5vw] md:text-[6vw] lg:text-[7vw] font-black font-sans uppercase tracking-tight text-white/2 select-none"
              >
                3D VISUALIZATION • UX DESIGN • DIGITAL MEDIA •
              </span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Corner Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-8 text-right hidden md:block"
      >
        <p className="text-sm text-white/40 max-w-xs leading-relaxed">
          Pushing the boundaries
          <br />
          of digital space
        </p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 sm:left-1/4"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center"
        >
          {/* Mobile/tablet: Swipe, Desktop: Scroll */}
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 rotate-90 origin-center mb-8 md:hidden">
            Swipe
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 rotate-90 origin-center mb-8 hidden md:inline">
            Scroll
          </span>
          <div className="h-16 w-px bg-linear-to-b from-white/30 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}