import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOXES = 10;
const PLACEHOLDER = '[LOCKED_DATA]';
let hoverHintShown = false;

export default function SkillBlockBar({ skill, index, groupStart }) {
  const [revealed, setRevealed] = React.useState(false);
  const [showHint, setShowHint] = React.useState(false);
  const ref = React.useRef();

  React.useEffect(() => {
    if (!('ontouchstart' in window)) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Only show the hint for the first unrevealed skill
  React.useEffect(() => {
    if (!revealed && !hoverHintShown) {
      setShowHint(true);
      hoverHintShown = true;
    }
  }, [revealed]);

  const filled = Math.round((skill.level / 100) * BOXES);

  function getGlitchText(text) {
    return text
      .split('')
      .map((char, i) =>
        Math.random() > 0.7
          ? String.fromCharCode(0x2588 + Math.floor(Math.random() * 10))
          : char
      )
      .join('');
  }

  return (
    <div className={"relative" + (groupStart ? " mt-4 md:mt-6" : "") }>
      {/* Scroll Indicator (Hero style) */}
      {index === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute -top-22 left-1/4 -translate-x-1/2 flex items-center gap-4 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 rotate-90 origin-center mb-6">
              HOVER
            </span>
            <div className="h-8 w-px bg-linear-to-t from-white/30 to-transparent" />
          </motion.div>
        </motion.div>
      )}

      <motion.div
        ref={ref}
        initial="idle"
        animate={revealed ? 'active' : 'idle'}
        variants={{
          idle: { opacity: 0.5, filter: 'blur(2px)' },
          active: { opacity: 1, filter: 'blur(0px)' },
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="group flex items-center justify-between border-b border-white/10 py-3 px-2 md:px-4 bg-black/60 hover:bg-black/80 transition-colors relative cursor-pointer"
        onMouseEnter={() => setRevealed(true)}
        tabIndex={0}
        aria-label={skill.name}
      >
        {/* Skill Name & Description */}
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-xs md:text-sm uppercase tracking-wider transition-colors select-none"
            style={{
              color: revealed ? '#fff' : '#6b7280',
              letterSpacing: revealed ? '0.15em' : '0.25em',
              transition: 'color 0.2s, letter-spacing 0.2s'
            }}
          >
            <AnimatePresence initial={false}>
              {revealed ? (
                <motion.span
                  key="real"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {skill.name}
                </motion.span>
              ) : (
                <motion.span
                  key="glitch"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  aria-hidden
                >
                  {getGlitchText(PLACEHOLDER)}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
          <span className="text-[11px] text-white/40 font-mono leading-tight">
            {skill.description}
          </span>
        </div>
        {/* Box Level Indicator */}
        <div className="flex items-center h-full ml-4 md:ml-8 gap-1">
          {Array.from({ length: BOXES }).map((_, i) => (
            <motion.div
              key={i}
              initial="idle"
              animate={revealed ? 'active' : 'idle'}
              variants={{
                idle: {
                  scale: 0.9,
                  opacity: 0.2,
                  background: '#e5e7eb',
                  boxShadow: 'none',
                },
                active: i < filled
                  ? {
                      scale: [0.9, 1.15, 1],
                      opacity: 1,
                      background: 'var(--color-accent)',
                      boxShadow: 'none',
                      transition: {
                        delay: 0.08 * i,
                        duration: 0.32,
                        type: 'spring',
                        stiffness: 300,
                      },
                    }
                  : {
                      scale: 0.9,
                      opacity: 0.2,
                      background: '#e5e7eb',
                      boxShadow: 'none',
                    },
              }}
              className="w-2.5 h-2.5 rounded-[1.5px]"
              style={{ marginRight: i !== BOXES - 1 ? 3 : 0 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
