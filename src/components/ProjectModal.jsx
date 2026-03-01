import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useEffect, useRef } from 'react';
import MouseMousepadComparison from './MouseMousepadComparison';
import ImageCompareSlider from './ImageCompareSlider';

export default function ProjectModal({ project, isOpen, onClose }) {
    // Responsive: stack graphics above text for all screens below 1280px (landscape & portrait)
    const [isStacked, setIsStacked] = useState(false);
    useEffect(() => {
      function handleStackedResize() {
        setIsStacked(window.innerWidth < 1280);
      }
      handleStackedResize();
      window.addEventListener('resize', handleStackedResize);
      return () => window.removeEventListener('resize', handleStackedResize);
    }, []);
  // Early return if project is null to prevent errors and black screen
  if (!project) return null;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const loadedImagesRef = useRef({});
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef();

  // Early return if project is null to prevent errors



  // Reset state when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setImageLoaded(false);
    setIsPaused(false);
  }, [project]);

  // Autoplay effect (disabled for Wedding Flyer / Interactive Wedding Invitation)
  const isWeddingFlyer =
    project &&
    project.title &&
    ['wedding flyer', 'interactive wedding invitation'].some((key) =>
      project.title.trim().toLowerCase().includes(key)
    );
  useEffect(() => {
    if (isWeddingFlyer) return;
    if (!isOpen || !project?.images?.length || project.images.length < 2 || isPaused) return;
    // Start first transition sooner
    let timeout = setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
      autoplayRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
      }, 2000);
    }, 1000); // 1 second for first image
    return () => {
      clearTimeout(timeout);
      clearInterval(autoplayRef.current);
    };
  }, [isOpen, project, isPaused, isWeddingFlyer]);

  // Handle escape key and lock scroll
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      if (window.lenis) {
        window.lenis.stop();
      }
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, [isOpen, onClose]);


  const handleNext = useCallback(() => {
    if (project?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
      setIsPaused(true); // manual override pauses autoplay
    }
  }, [project]);

  const handlePrev = useCallback(() => {
    if (project?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
      setIsPaused(true); // manual override pauses autoplay
    }
  }, [project]);

  const handleImageLoad = useCallback((src) => {
    if (src) {
      loadedImagesRef.current[src] = true;
    }
    setImageLoaded(true);
  }, []);


  // For Wedding Flyer / Interactive Wedding Invitation, always show the GIF as the only image, no autoplay
  let hasMultipleImages = project.images?.length > 1;
  // Special sizing for Naturrausch Website
  const isNaturrausch = project && project.title && project.title.trim().toLowerCase().includes('naturrausch');
  let imagesToShow = [];
  if (isWeddingFlyer) {
    // Use Vite static import for GIF
    const gifModules = import.meta.glob('/src/assets/projects_new/Interactive wedding invitation/01_compressed.gif', { eager: true, import: 'default' });
    imagesToShow = [gifModules['/src/assets/projects_new/Interactive wedding invitation/01_compressed.gif']];
    hasMultipleImages = false;
  } else if (project.images && project.images.length > 0) {
    imagesToShow = project.images;
  } else if (project.image) {
    imagesToShow = [project.image];
  }

  // Keep track of which images are already loaded so we only show
  // the loading spinner the first time each image appears.
  useEffect(() => {
    if (!imagesToShow.length) return;
    const currentSrc = imagesToShow[currentImageIndex];
    if (loadedImagesRef.current[currentSrc]) {
      setImageLoaded(true);
    } else {
      setImageLoaded(false);
    }
  }, [currentImageIndex, imagesToShow]);

  // Preload all images for the current project so that upcoming
  // slides are fetched in the background while the user views
  // the current one. This makes switches feel instant instead
  // of waiting for the network when the index changes.
  useEffect(() => {
    if (!isOpen || !imagesToShow.length) return;

    imagesToShow.forEach((src) => {
      if (!src || loadedImagesRef.current[src]) return;

      const img = new Image();
      img.src = src;

      if (img.complete) {
        loadedImagesRef.current[src] = true;
        if (src === imagesToShow[currentImageIndex]) {
          setImageLoaded(true);
        }
      } else {
        img.onload = () => {
          loadedImagesRef.current[src] = true;
          if (src === imagesToShow[currentImageIndex]) {
            setImageLoaded(true);
          }
        };
      }
    });
  }, [isOpen, imagesToShow, currentImageIndex]);

  return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/98 min-h-screen overflow-y-auto"
            onClick={onClose}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Noise Texture */}
            <div 
              className="pointer-events-none fixed inset-0 opacity-20 mix-blend-overlay"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
            />

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={onClose}
              className="fixed top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/60 transition-all hover:border-white/40 hover:text-white hover:scale-110"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Main Modal Content: Responsive layout */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
              className={`relative z-10 w-full bg-black flex flex-col ${isStacked ? '' : 'xl:flex-row'}`}
            >
              {/* Graphics above text for tablet/mobile */}
              <div className={`w-full ${isStacked ? '' : 'xl:w-1/2'} flex items-center justify-center p-2 xl:p-8 rounded-t-2xl min-h-0`} style={{minHeight: '220px', height: '70vh', maxHeight: '80vh', justifyContent: 'center', alignItems: 'center'}}>
                {/* Mouse + Mousepad 3D Render: comparison slider */}
                {project.slider ? (
                  <div className="w-full h-full flex items-center justify-center" style={{justifyContent: 'center', alignItems: 'center'}}>
                    <ImageCompareSlider
                      leftImage={
                        // For Photorealistic 3D Reconstruction, force JPEGs from the slider subfolder
                        (project.id === 4
                          ? new URL('../assets/projects_new/Photorealistic 3D Reconstruction/slider/slide_left.jpg', import.meta.url).href
                          : (
                              project.sliderImages?.find(img => {
                                const base = img.split('/').pop().split('.')[0].toLowerCase();
                                return base === project.slider.leftImage.split('.')[0].toLowerCase();
                              }) ||
                              project.sliderImages?.find(img => img.toLowerCase().includes(project.slider.leftImage.toLowerCase().replace(/\.[a-z]+$/, '')))
                              || project.images?.find(img => {
                                const base = img.split('/').pop().split('.')[0].toLowerCase();
                                return base === project.slider.leftImage.split('.')[0].toLowerCase();
                              }) ||
                              project.images?.find(img => img.toLowerCase().includes(project.slider.leftImage.toLowerCase().replace(/\.[a-z]+$/, '')))
                              || project.sliderImages?.[0] || project.images?.[0]
                            )
                        )
                      }
                      rightImage={
                        (project.id === 4
                          ? new URL('../assets/projects_new/Photorealistic 3D Reconstruction/slider/slide_right.jpg', import.meta.url).href
                          : (
                              project.sliderImages?.find(img => {
                                const base = img.split('/').pop().split('.')[0].toLowerCase();
                                return base === project.slider.rightImage.split('.')[0].toLowerCase();
                              }) ||
                              project.sliderImages?.find(img => img.toLowerCase().includes(project.slider.rightImage.toLowerCase().replace(/\.[a-z]+$/, '')))
                              || project.images?.find(img => {
                                const base = img.split('/').pop().split('.')[0].toLowerCase();
                                return base === project.slider.rightImage.split('.')[0].toLowerCase();
                              }) ||
                              project.images?.find(img => img.toLowerCase().includes(project.slider.rightImage.toLowerCase().replace(/\.[a-z]+$/, '')))
                              || project.sliderImages?.[1] || project.images?.[1]
                            )
                        )
                      }
                      leftLabel={project.slider.leftLabel}
                      rightLabel={project.slider.rightLabel}
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center" style={{width: '100%', height: '100%', minHeight: '220px', maxHeight: '80vh'}}>
                    {imagesToShow.map((img, idx) => {
                      const isActive = currentImageIndex === idx;
                      return (
                        <img
                          key={img}
                          src={img}
                          alt={project.title}
                          onLoad={isActive ? () => handleImageLoad(img) : undefined}
                          className={
                            `object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 will-change-opacity bg-black rounded-2xl ` +
                            (isNaturrausch ? 'w-full z-20' : 'w-full z-10') +
                            `${isActive && imageLoaded ? ' opacity-100' : ' opacity-0'}`
                          }
                          style={{ pointerEvents: 'none', width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', minHeight: '180px', background: 'black', display: 'block' }}
                        />
                      );
                    })}
                    {/* Loading indicator */}
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <svg className="animate-spin h-12 w-12 text-accent" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle className="opacity-20" cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="6" />
                          <path d="M44 24c0-11.046-8.954-20-20-20" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="opacity-80" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              {/* Close missing div for left visual section */}
              </div>

              {/* Text below graphics for tablet/mobile */}
              <div className={`w-full ${isStacked ? '' : 'xl:w-1/2'} flex flex-col justify-start p-2 xl:p-8 pb-10 md:pb-12 min-h-0`}>
              {/* Header Row */}
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                {/* Title & Category */}
                <div className="flex-1">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-[10px] uppercase tracking-[0.4em] text-accent"
                  >
                    {/* If category is id: [number] or [number], use next line from description */}
                    {(/^id:\s*\d+$/i.test(project.category) || /^\[number\]$/i.test(project.category))
                      ? (project.description?.split('\n')[0] || '')
                      : project.category}
                  </motion.span>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mt-4 text-3xl font-black uppercase tracking-tighter text-white md:text-5xl lg:text-6xl"
                    style={{ wordBreak: 'break-word' }}
                  >
                    {project.title}
                  </motion.h1>
                </div>

                {/* Meta Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-4 md:pt-8"
                >
                </motion.div>
              </div>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.45, duration: 0.8 }}
                className="my-8 h-px w-full origin-left bg-white/10"
              />

              {/* Details Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                  // Details
                </span>

                <div className="mt-8">
                  {project.description ? (
                    (() => {
                      const lines = project.description.split('\n').filter(line => line.trim());
                      const sections = [];
                      let currentSection = null;
                      let headerInfo = null;
                      let dateInfo = null;

                      lines.forEach((line, idx) => {
                        const trimmed = line.trim();
                        const isBullet = trimmed.startsWith('-') || trimmed.startsWith('•');
                        const content = isBullet ? trimmed.slice(1).trim() : trimmed;
                        const colonIndex = content.indexOf(':');
                        const hasBulletWithColon = isBullet && colonIndex > 0 && colonIndex < 50;
                        
                        // Check if it's a date line (contains year patterns like 2021, 2023)
                        const isDate = /\d{4}/.test(trimmed) && (trimmed.includes('–') || trimmed.includes('-') || trimmed.toLowerCase().includes('present'));
                        
                        // First line without bullet = header/role
                        if (idx === 0 && !isBullet) {
                          headerInfo = trimmed;
                        }
                        // Date info
                        else if (isDate && !isBullet) {
                          dateInfo = trimmed;
                        }
                        // Section header (non-bullet, no colon, not first line, not date)
                        else if (!isBullet && colonIndex === -1 && !isDate) {
                          currentSection = { title: trimmed, items: [] };
                          sections.push(currentSection);
                        }
                        // Bullet with colon = detail item
                        else if (hasBulletWithColon) {
                          if (!currentSection) {
                            currentSection = { title: null, items: [] };
                            sections.push(currentSection);
                          }
                          currentSection.items.push({
                            title: content.slice(0, colonIndex),
                            description: content.slice(colonIndex + 1).trim()
                          });
                        }
                        // Plain text line
                        else if (!isBullet && content) {
                          if (!currentSection) {
                            currentSection = { title: null, items: [] };
                            sections.push(currentSection);
                          }
                          currentSection.items.push({ description: content });
                        }
                      });

                      return (
                        <>
                          {/* Header & Date Row */}
                          {(headerInfo || dateInfo) && (
                            <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-white/10 pb-6">
                              {headerInfo && (
                                <span className="text-lg font-bold text-white">{headerInfo}</span>
                              )}
                              {dateInfo && (
                                <span className="rounded-full border border-accent/30 bg-accent/10 px-4 py-1 font-mono text-xs text-accent">
                                  {dateInfo}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Sections */}
                          <div className="space-y-10">
                            {sections.map((section, sIdx) => (
                              <motion.div
                                key={sIdx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.55 + sIdx * 0.1 }}
                              >
                                {section.title && (
                                  <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-accent">
                                    {section.title}
                                  </h3>
                                )}
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                  {section.items.map((item, iIdx) => (
                                    <div
                                      key={iIdx}
                                      className="border-b border-white/5 py-4 pr-6"
                                    >
                                      {item.title ? (
                                        <>
                                          <h4 className="font-mono text-sm uppercase tracking-wider text-white">
                                            {item.title}
                                          </h4>
                                          <p className="mt-2 text-sm leading-relaxed text-white/50">
                                            {item.description}
                                          </p>
                                        </>
                                      ) : (
                                        <p className="text-sm leading-relaxed text-white/60">{item.description}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                            {/* Place hyperlink at the bottom for any project with a link */}
                            {project.link && (
                              <div className="mt-16 flex flex-col items-center justify-center gap-4">
                                <div className="flex flex-row items-center justify-center gap-6 w-full">
                                  <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-accent underline underline-offset-4 hover:text-accent/80 transition-colors text-lg text-center"
                                    data-cursor="project"
                                    style={{ minWidth: '220px' }}
                                  >
                                    {project.link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                  </a>
                                  <motion.div
                                    animate={{ x: [0, 10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    className="flex flex-row items-center"
                                  >
                                    <div className="w-16 h-px bg-linear-to-r from-white/30 to-transparent"></div>
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Click</span>
                                  </motion.div>
                                </div>
                              </div>
                            )}
                            {/* Always show login hint if present */}
                            {project.hint && (
                              <div
                                className="mt-10 text-xs text-white/50 text-center max-w-xs mx-auto"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    typeof project.hint === 'string'
                                      ? project.hint.replace(/(dummy logins)/i, '<span class=\"text-accent\">$1</span>')
                                      : project.hint
                                }}
                              />
                            )}
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <p className="text-base text-white/40">No description available.</p>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}