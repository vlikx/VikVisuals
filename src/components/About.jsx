import { motion } from 'framer-motion';
import { useState } from 'react';
import SkillBlockBar from './SkillBlockBar';
import PortraitVS from '../assets/Portrait_VS.jpg';

const infoData = [
  { label: 'FOCUS', value: 'UX STUDY // COLLECTING EXPERIENCE' },
  { label: 'EXPERIENCE', value: '5+' },
  { label: 'LOCATION', value: 'DE // REMOTE' },
  { label: 'PLATFORMS', value: 'MAC + WINDOWS' },
];

const skills = [
  // Design & Creative
  { name: 'Adobe Photoshop', description: ' High-End Retouching & Post-Production', level: 90, category: 'Design & Creative' },
  { name: 'Adobe InDesign', description: 'All sorts of printmedia', level: 80, category: 'Design & Creative' },
  { name: 'Adobe Illustrator', description: 'Vector graphics, branding, icons', level: 80, category: 'Design & Creative' },
  { name: 'Print & Packaging', description: 'Print-ready files & prepress production (flexographic printing & digital printing)', level: 90, category: 'Design & Creative' },
  { name: 'Creating Presentations', description: 'Conferences, projects & explanation of solutions', level: 70, category: 'Design & Creative' },
  { name: 'Photography', description: 'Weddings, Birthdays & Events', level: 50, category: 'Design & Creative' },

  // 3D & Motion
  { name: 'Autodesk Maya', description: '3D modeling, animation & rendering', level: 60, category: '3D & Motion' },
  { name: 'Blender', description: '3D modeling, animation & rendering', level: 50, category: '3D & Motion' },
  { name: 'After Effects', description: 'Motion graphics & animation', level: 40, category: '3D & Motion' },
  { name: 'Adobe Premiere', description: 'Video editingn', level: 40, category: '3D & Motion' },

  // UX & Research
  { name: 'Prototyping', description: 'Interactive prototypes with Code (Vibe Coding) & Figma', level: 60, category: 'UX & Research' },
  { name: 'User Research', description: 'User interviews, surveys, usability testing', level: 50, category: 'UX & Research' },
];

// Group skills by thematic category for clustering, sorted by level descending
const skillGroups = [
  {
    label: 'Design & Creative',
    skills: skills
      .filter((s) => s.category === 'Design & Creative')
      .sort((a, b) => b.level - a.level),
  },
  {
    label: '3D & Motion',
    skills: skills
      .filter((s) => s.category === '3D & Motion')
      .sort((a, b) => b.level - a.level),
  },
  {
    label: 'UX & Research',
    skills: skills
      .filter((s) => s.category === 'UX & Research')
      .sort((a, b) => b.level - a.level),
  },
];

// Flicker animation variants
const flickerIn = {
  hidden: { opacity: 0, filter: 'blur(4px)' },
  visible: (i) => ({
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.15,
      duration: 0.1,
      repeat: 2,
      repeatType: 'reverse',
    },
  }),
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  const [showPortraitModal, setShowPortraitModal] = useState(false);

  // ...existing code...

  return (
    <section id="about" className="relative px-6 py-32 md:px-12 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">
            // STATUS
          </span>
        </motion.div>
        {/* Portrait Frame left aligned, clickable for fullscreen */}
        <div className="mb-6 flex justify-start items-center gap-4">
          <div
            className="relative rounded-full border-2 border-white/10 bg-linear-to-br from-black via-black/60 to-accent/30 shadow-xl overflow-hidden w-28 h-28 flex items-center justify-center cursor-pointer group"
            data-cursor="project"
            onClick={() => setShowPortraitModal(true)}
          >
            <img
              src={PortraitVS}
              alt="Viktor Stang Portrait"
              className="object-cover w-full h-full rounded-full shadow-md border border-white/10 group-hover:scale-105 transition-transform duration-300"
              style={{ boxShadow: '0 4px 16px 0 rgba(0,0,0,0.25)' }}
            />
            {/* Accent border overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent/40 opacity-60" />
            {/* Subtle noise overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url(\"data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E\")' }} />
          </div>
          {/* Click hint to the right, horizontal with line in front, animated like scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="flex flex-row items-center ml-2 select-none gap-2"
          >
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-row items-center"
            >
              <div className="w-16 h-px bg-linear-to-r from-white/30 to-transparent"></div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Click</span>
            </motion.div>
          </motion.div>
        </div>
        {/* Name below portrait, left aligned */}
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-2xl font-bold uppercase tracking-tight text-white md:text-4xl text-left"
        >
          VIKTOR STANG
        </motion.h2>
        {/* Portrait Modal */}
        {showPortraitModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={() => setShowPortraitModal(false)}
          >
            <div className="relative flex items-center justify-center">
              <div className="aspect-square w-[min(80vw,80vh)] max-w-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden items-center justify-center bg-black">
                  <img
                    src={PortraitVS}
                    alt="Viktor Stang Portrait Fullscreen"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Close Button - same style as modal */}
                <button
                  className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/60 transition-all hover:border-white/40 hover:text-white hover:scale-110"
                  onClick={e => { e.stopPropagation(); setShowPortraitModal(false); }}
                  aria-label="Close"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
        {/* Info Grid - Technical Readout */}
        <div className="mb-24 grid grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
          {infoData.map((item, i) => (
            <motion.div
              key={item.label}
              custom={i}
              variants={flickerIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-black p-6"
            >
              <span className="block text-[10px] uppercase tracking-[0.3em] text-white/30">
                {item.label}
              </span>
              <span className="mt-2 block font-mono text-sm text-white md:text-base">
                {item.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Skills - Technical Dashboard Grid, visually clustered by group */}
        <div className="grid gap-2 md:grid-cols-2">
          {skillGroups.map((group, groupIdx) => (
            <div
              key={group.label}
              className={
                groupIdx > 0
                  ? 'mt-12 md:col-span-2 border-t border-white/10 pt-8'
                  : 'md:col-span-2'
              }
            >
              <div className="mb-2 ml-1 text-xs font-bold uppercase tracking-widest text-accent/80 select-none">
                {group.label}
              </div>
              {group.skills.map((skill, idx) => (
                <SkillBlockBar
                  key={skill.name}
                  skill={skill}
                  index={idx + skillGroups.slice(0, groupIdx).reduce((acc, g) => acc + g.skills.length, 0)}
                  groupStart={idx === 0}
                />
              ))}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}