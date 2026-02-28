import { useEffect, useRef, memo } from 'react';
import Lenis from 'lenis';

const SmoothScroll = memo(function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Expose lenis instance globally for modal control
    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      // Proper cleanup - cancel RAF before destroying Lenis
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.lenis = null;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
});

export default SmoothScroll;
