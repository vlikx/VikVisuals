import { motion, useMotionValue } from 'framer-motion';
import { useEffect, useState, useCallback, memo } from 'react';

const CustomCursor = memo(function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [cursorMode, setCursorMode] = useState('default');

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

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

    // Check for LinkedIn or similar links
    let isLinkedView = false;
    const linkEl = target.closest('a');
    if (linkEl && linkEl.href) {
      const href = linkEl.href.toLowerCase();
      if (href.includes('linkedin') || href.includes('behance') || href.includes('dribbble') || href.includes('github')) {
        isLinkedView = true;
      }
    }

    if (isProject || isLinkedView) {
      if (cursorMode !== 'view') setCursorMode('view');
      setIsHovering(true);
      setCursorText('VIEW');
      setIsPointer(false);
    } else if (isClickable) {
      if (cursorMode !== 'pointer') setCursorMode('pointer');
      setIsPointer(true);
      setIsHovering(false);
      setCursorText('');
    } else {
      if (cursorMode !== 'default') setCursorMode('default');
      setIsPointer(false);
      setIsHovering(false);
      setCursorText('');
    }
  }, [cursorMode]);

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
        className="pointer-events-none fixed left-0 top-0 z-9999 mix-blend-difference will-change-transform"
        style={{
          x: cursorX,
          y: cursorY,
          willChange: 'transform',
        }}
      >
        <motion.div
          className="relative flex items-center justify-center will-change-transform"
          style={{ perspective: 600, transformStyle: 'preserve-3d' }}
          animate={{
            width: isHovering ? 120 : isPointer ? 40 : 12,
            height: isHovering ? 120 : isPointer ? 40 : 12,
            x: isHovering ? -60 : isPointer ? -20 : -6,
            y: isHovering ? -60 : isPointer ? -20 : -6,
            rotateY: cursorMode === 'view' ? 180 : cursorMode === 'pointer' ? 90 : 0,
          }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
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
            transition={{ duration: 0 }}
          />
          
          {/* Core dot */}
          <motion.div
            className="rounded-full bg-white"
            animate={{
              width: isHovering ? 0 : isPointer ? 8 : 12,
              height: isHovering ? 0 : isPointer ? 8 : 12,
            }}
            transition={{ duration: 0 }}
          />

          {/* Hover text */}
          {cursorText && (
            <span
              className="absolute text-[10px] font-bold uppercase tracking-widest text-white"
              style={{ transform: cursorMode === 'view' ? 'rotateY(180deg)' : 'none' }}
            >
              {cursorText}
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* Outer ring stays aligned with the pointer */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-9998 will-change-transform"
        style={{
          x: cursorX,
          y: cursorY,
          willChange: 'transform',
        }}
      >
        <motion.div
          className="rounded-full will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{
            width: isHovering ? 150 : isPointer ? 50 : 40,
            height: isHovering ? 150 : isPointer ? 50 : 40,
            x: isHovering ? -75 : isPointer ? -25 : -20,
            y: isHovering ? -75 : isPointer ? -25 : -20,
            rotateY: cursorMode === 'view' ? 180 : cursorMode === 'pointer' ? 90 : 0,
            boxShadow: isHovering
              ? '0 0 0 4px rgba(0,212,255,0.7), 0 0 32px 8px rgba(0,212,255,0.25)'
              : 'none',
            border: isHovering
              ? '3px solid rgba(0,212,255,0.85)'
              : '1px solid rgba(255,255,255,0.2)',
          }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
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