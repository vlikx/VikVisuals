import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState, useCallback, memo } from 'react';

const CustomCursor = memo(function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [cursorText, setCursorText] = useState('');

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring physics for the cursor
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Outer ring with more lag
  const outerSpringConfig = { damping: 30, stiffness: 150, mass: 1 };
  const outerXSpring = useSpring(cursorX, outerSpringConfig);
  const outerYSpring = useSpring(cursorY, outerSpringConfig);

  // Memoized event handlers
  const moveCursor = useCallback((e) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  }, [cursorX, cursorY]);

  const handleMouseOver = useCallback((e) => {
    const target = e.target;
    
    // Check for interactive elements
    const isClickable = 
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') ||
      target.closest('button') ||
      target.dataset?.cursor === 'pointer';

    const isProject = target.closest('[data-cursor="project"]');
    
    if (isProject) {
      setIsHovering(true);
      setCursorText('VIEW');
    } else if (isClickable) {
      setIsPointer(true);
      setIsHovering(false);
      setCursorText('');
    } else {
      setIsPointer(false);
      setIsHovering(false);
      setCursorText('');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [moveCursor, handleMouseOver]);

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference will-change-transform"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          willChange: 'transform',
        }}
      >
        <motion.div
          className="relative flex items-center justify-center will-change-transform"
          animate={{
            width: isHovering ? 120 : isPointer ? 40 : 12,
            height: isHovering ? 120 : isPointer ? 40 : 12,
            x: isHovering ? -60 : isPointer ? -20 : -6,
            y: isHovering ? -60 : isPointer ? -20 : -6,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {/* Lens effect background */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: isHovering 
                ? 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)'
                : 'transparent',
              backdropFilter: isHovering ? 'blur(2px) saturate(1.5)' : 'none',
            }}
            animate={{
              scale: isHovering ? 1 : 0,
            }}
          />
          
          {/* Core dot */}
          <motion.div
            className="rounded-full bg-white"
            animate={{
              width: isHovering ? 0 : isPointer ? 8 : 12,
              height: isHovering ? 0 : isPointer ? 8 : 12,
            }}
          />

          {/* Hover text */}
          {cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute text-[10px] font-bold uppercase tracking-widest text-white"
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Outer ring - follows with delay */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] will-change-transform"
        style={{
          x: outerXSpring,
          y: outerYSpring,
          willChange: 'transform',
        }}
      >
        <motion.div
          className="rounded-full will-change-transform"
          animate={{
            width: isHovering ? 150 : isPointer ? 50 : 40,
            height: isHovering ? 150 : isPointer ? 50 : 40,
            x: isHovering ? -75 : isPointer ? -25 : -20,
            y: isHovering ? -75 : isPointer ? -25 : -20,
            boxShadow: isHovering
              ? '0 0 0 4px rgba(0,212,255,0.7), 0 0 32px 8px rgba(0,212,255,0.25)'
              : 'none',
            border: isHovering
              ? '3px solid rgba(0,212,255,0.85)'
              : '1px solid rgba(255,255,255,0.2)',
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        />
      </motion.div>

      {/* Hide default cursor globally */}
      <style>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
});

export default CustomCursor;
