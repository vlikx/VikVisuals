import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect, memo, useCallback, useMemo } from 'react';
import { loadProjects, getProjectColumns } from '../utils/projectLoader';

// Preload GIF for Interactive Wedding Invitation (former Wedding Flyer) for Vite compatibility
const weddingGifModules = import.meta.glob('/src/assets/projects_new/Interactive wedding invitation/01_compressed.gif', { eager: true, import: 'default' });
import ProjectModal from './ProjectModal';
import { AnimatePresence } from 'framer-motion';

// Auto-load projects from src/assets/projects/
const projects = loadProjects();


const ParallaxCard = memo(function ParallaxCard({ project, index, onClick }) {
  const ref = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [hovered, setHovered] = useState(false);
  // For GIF: only mount after a short delay to avoid browser preloading
  const [showWeddingGif, setShowWeddingGif] = useState(false);
  const weddingGifTimeout = useRef();
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const autoplayRef = useRef();

  // Special: Interactive Wedding Invitation (former Wedding Flyer) GIF overlay
  const isWeddingFlyer = project.title.trim().toLowerCase().includes('interactive wedding invitation');
  const [weddingGif, setWeddingGif] = useState(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Each card has unique scroll speed - reduced for smoother feel
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [50 * project.scrollSpeed, -50 * project.scrollSpeed]
  );

  // Aspect ratios vary by column
  const aspects = ['aspect-square', 'aspect-square', 'aspect-square'];
  const aspect = aspects[project.column];

  // Memoized callbacks for image handlers
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback(() => setImageError(true), []);

  // Autoplay on hover for multiple images
  useEffect(() => {
    if (!hovered || !project.images || project.images.length < 2) return;
    // Instantly show next image on hover
    setCurrentImageIdx((prev) => (prev + 1) % project.images.length);
    autoplayRef.current = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % project.images.length);
    }, 2000);
    return () => clearInterval(autoplayRef.current);
  }, [hovered, project]);

  // Reset image index when not hovered or project changes
  useEffect(() => {
    if (!hovered) setCurrentImageIdx(0);
  }, [hovered, project]);

  // Pick image: if multiple, use currentImageIdx, else fallback to project.image
  const displayImage = project.images && project.images.length > 0
    ? project.images[currentImageIdx]
    : project.image;
  // Special sizing for Naturrausch Website
  const isNaturrausch = project.title.trim().toLowerCase().includes('naturrausch');
  // Special sizing for Dashboard Prototype
  const isDashboardPrototype = project.title.trim().toLowerCase().includes('dashboard prototype');
  // Special sizing for 3D Mockups for Koestlin GmbH
  const isKoestlinMockup = project.title.trim().toLowerCase().includes('3d mockups for koestlin gmbh');
  // Special sizing for VHS Aalen Redesign
  const isVHSAalen = project.title.trim().toLowerCase().includes('vhs aalen redesign');

    return (
      <motion.article
        ref={ref}
        style={{ y, marginTop: project.overlap, willChange: 'transform' }}
        className="relative z-10 will-change-transform cursor-pointer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, delay: index * 0.05 }}
        data-cursor="project"
        onClick={() => onClick(project)}
        onMouseEnter={async () => {
          setHovered(true);
          if (isWeddingFlyer) {
            weddingGifTimeout.current = setTimeout(() => {
              // Use Vite static import
              const gif = weddingGifModules['/src/assets/projects_new/Interactive wedding invitation/01_compressed.gif'];
              setWeddingGif(gif);
              setShowWeddingGif(true);
            }, 50);
          }
        }}
        onMouseLeave={() => {
          setHovered(false);
          if (isWeddingFlyer) {
            setShowWeddingGif(false);
            setWeddingGif(null);
            clearTimeout(weddingGifTimeout.current);
          }
        }}
      >
        <div
          className={`group relative ${aspect} w-full overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-700/60
                     transition-colors duration-700 ease-out
                     hover:border-neutral-500/40`}
          style={{ padding: '24px' }}
        >
          {/* Neutral Background Gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-neutral-800 via-neutral-900 to-neutral-950"> 

            {/* Image */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              {isWeddingFlyer ? (
                <>
                  {/* Show cover.png only when not showing GIF */}
                  <img
                    src={new URL('../assets/projects_new/Interactive wedding invitation/Wedding Fyler Cover.png', import.meta.url).href}
                    alt="Wedding Flyer Cover"
                    className={`absolute transition-all duration-500 z-10 w-full h-full max-w-full max-h-full object-contain ${showWeddingGif ? 'opacity-0' : 'opacity-100'}`}
                    style={{
                      pointerEvents: 'none',
                      boxShadow: 'none',
                      transform: 'scale(0.85)',
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      margin: 'auto',
                    }}
                    draggable={false}
                  />
                  {/* Show GIF only on hover */}
                  {showWeddingGif && weddingGif && (
                    <img
                      src={weddingGif}
                      alt="Wedding Flyer Animation"
                      className="absolute transition-all duration-500 z-20 w-full h-full max-w-full max-h-full object-contain"
                      style={{
                        right: '0%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        filter: 'drop-shadow(0 8px 48px rgba(0,0,0,0.35))',
                        pointerEvents: 'none',
                      }}
                      draggable={false}
                    />
                  )}
                </>
              ) : (
                project.images && project.images.length > 1
                  ? project.images.map((img, idx) => (
                      <img
                        key={img}
                        src={img}
                        alt={project.title}
                        className={
                          `object-contain rounded-2xl absolute left-0 top-0 right-0 bottom-0 m-auto transition-opacity duration-700 will-change-opacity ` +
                          'w-full h-full max-w-full max-h-full object-contain rounded-2xl absolute left-0 top-0 right-0 bottom-0 m-auto transition-opacity duration-700 will-change-opacity z-10 group-hover:scale-105' +
                          `${currentImageIdx === idx && imageLoaded ? ' opacity-100' : ' opacity-0'}`
                        }
                             style={{ pointerEvents: 'none', boxShadow: 'none', transform: 'scale(0.8)' }}
                        loading="lazy"
                        decoding="async"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    ))
                  : displayImage && !imageError && (
                      <img
                        key={displayImage}
                        src={displayImage}
                        alt={project.title}
                        className={
                          `object-contain rounded-2xl transition-all duration-700 will-change-transform will-change-opacity opacity-100 ` +
                          'w-full h-full max-w-full max-h-full object-contain rounded-2xl transition-all duration-700 will-change-transform will-change-opacity opacity-100 z-10 group-hover:scale-105'
                        }
                             style={{ pointerEvents: 'none', boxShadow: 'none', transform: 'scale(0.8)' }}
                        loading="lazy"
                        decoding="async"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    )
              )}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

            {/* Noise texture */}
            <div className="absolute inset-0 opacity-30 mix-blend-overlay" 
                 style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/ %3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/ %3E%3C/svg%3E")' }} />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <h3
              className="font-mono font-bold text-white tracking-tight leading-none overflow-hidden text-ellipsis text-center"
                style={{
                  letterSpacing: '-0.03em',
                  fontSize: 'clamp(0.9rem, 1.4vw + 0.7rem, 1.6rem)',
                  lineHeight: '1.1',
                  maxWidth: '100%',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  position: 'relative',
                  zIndex: 30,
                }}
                title={project.title}
              >
                {project.title}
              </h3>
          </div>
        </div>
      </motion.article>
    );
});

// Memoized column offsets: left and right aligned, middle lower
const columnOffsets = [0, 80, 0];

// Column labels to clarify grouping for better UX
const columnLabels = ['Digital / UX', 'Print & Identity', '3D & Visualization'];

export default function ProjectGrid() {
  const containerRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoize columns computation
  const columns = useMemo(() => getProjectColumns(projects), []);

  // Show a single "More Projects Coming Soon" placeholder once,
  // at the bottom of the currently shortest column for better balance
  {
    const placeholderId = 'coming-soon';
    const hasPlaceholder = columns.some(col => col.some(p => p.id === placeholderId));
    if (!hasPlaceholder) {
      // Find index of shortest column
      let shortestIndex = 0;
      let minLength = columns[0]?.length ?? 0;
      for (let i = 1; i < columns.length; i++) {
        if ((columns[i]?.length ?? 0) < minLength) {
          shortestIndex = i;
          minLength = columns[i]?.length ?? 0;
        }
      }

      columns[shortestIndex].push({
        id: placeholderId,
        title: 'More Projects Coming Soon',
        category: '3D Visualization',
        description: 'New work is in progress and will be added soon.',
        image: null,
        images: [],
        color: 'from-gray-800/80 to-gray-900/80',
        scrollSpeed: 1,
        overlap: 0,
        column: shortestIndex,
        debug: 'placeholder',
        isPlaceholder: true,
      });
    }
  }

  const handleProjectClick = useCallback((project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProject(null);
  }, []);

  return (
    <section id="work" ref={containerRef} className="relative w-full py-32 bg-black overflow-hidden">
      {/* Section Title - Brutalist bleeding */}
      <div className="relative mb-24">
        <motion.h2
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full text-center text-[16vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw] font-black leading-none tracking-tighter text-white/10 whitespace-nowrap select-none will-change-transform"
        >
        PROJECTS
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute bottom-0 left-0 px-4 md:px-10"
        >
        </motion.div>
      </div>

      {/* Liquid Masonry Grid */}
      <div className="w-full px-2 md:px-6">
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="text-6xl mb-6 opacity-20">+</div>
            <p className="text-lg text-white/40 max-w-md">
              Add your project images to <code className="text-white/60">src/assets/projects/</code>
            </p>
            <p className="text-sm text-white/30 mt-2">
              Supported: .jpg, .png, .webp, .avif
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {columns.map((column, colIndex) => (
              <div
                key={colIndex}
                className="flex flex-col gap-2.5"
                style={{ marginTop: columnOffsets[colIndex] }}
              >
                {/* Column label - desktop only for clarity */}
                <div className="mb-4 hidden md:block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                    {columnLabels[colIndex]}
                  </span>
                </div>
                {column.map((project, i) => (
                  project.id === 'coming-soon' ? (
                      <div
                        key={project.id}
                        className="group relative aspect-square w-full overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-700/60 flex items-center justify-center shadow-lg cursor-pointer transparency-60"
                        style={{ opacity: 0.4, marginTop: '3rem' }}
                        data-cursor="view"
                      >
                        {/* Gradient effect from other grids with reduced opacity */}
                        <div className="absolute inset-0 bg-linear-to-br from-neutral-800/70 via-neutral-900/80 to-neutral-950/90" />
                      <div className="flex flex-col items-center justify-center w-full h-full px-5 py-4 relative z-10">
                        <span className="text-5xl md:text-6xl font-black text-white mb-2 flex items-center justify-center">
                          <svg xmlns='http://www.w3.org/2000/svg' className='inline-block h-12 w-12 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' /></svg>
                        </span>
                        <h3
                          className="font-sans font-bold text-white text-center mb-2 tracking-tight leading-none"
                          style={{
                            letterSpacing: '-0.03em',
                            fontSize: 'clamp(1rem, 2vw + 0.6rem, 1.6rem)',
                            lineHeight: '1.1',
                            maxWidth: '100%',
                          }}
                          title={project.title}
                        >
                          {project.title}
                        </h3>
                        <p className="text-sm leading-snug text-white/70 text-center font-sans font-normal mt-1 max-w-xs mx-auto">{project.description}</p>
                      </div>
                    </div>
                  ) : (
                    <ParallaxCard
                      key={project.id}
                      project={project}
                      index={colIndex * 3 + i}
                      onClick={handleProjectClick}
                    />
                  )
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expand Projects button removed */}

      {/* Project Modal with fade transition (AnimatePresence for exit) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="project-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50 }}
          >
            <ProjectModal
              project={selectedProject}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}