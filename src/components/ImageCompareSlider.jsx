import React, { useRef, useState } from 'react';
import './ImageCompareSlider.css';


export default function ImageCompareSlider({ leftImage, rightImage, leftLabel = 'Original', rightLabel = '3D Render' }) {
  const containerRef = useRef(null);
  const [sliderPos, setSliderPos] = useState(50);
  const dragging = useRef(false);
  const autoMoveRef = useRef();

  const handleDrag = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    let percent = ((x - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    setSliderPos(percent);
  };

  const [isUserDragging, setIsUserDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const startDrag = () => {
    dragging.current = true;
    setIsUserDragging(true);
  };
  const stopDrag = () => {
    dragging.current = false;
    setIsUserDragging(false);
  };


  // Drag event listeners
  React.useEffect(() => {
    const move = (e) => { if (dragging.current) handleDrag(e); };
    const up = () => { dragging.current = false; };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
  }, []);

  // Auto-move slider left to right and back
  React.useEffect(() => {
    let direction = 1; // 1 = right, -1 = left
    let rafId;
    let lastTime = null;
    const speed = 18; // percent per second

    function animateSlider(time) {
      if (isUserDragging || isHovering) {
        rafId = requestAnimationFrame(animateSlider);
        lastTime = time;
        return;
      }
      if (lastTime === null) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      setSliderPos(prev => {
        let next = prev + direction * speed * dt;
        if (next > 100) {
          next = 100;
          direction = -1;
        } else if (next < 0) {
          next = 0;
          direction = 1;
        }
        return next;
      });
      rafId = requestAnimationFrame(animateSlider);
    }
    rafId = requestAnimationFrame(animateSlider);
    return () => cancelAnimationFrame(rafId);
  }, [isUserDragging, isHovering]);

  return (
    <div
      className="image-compare-slider"
      ref={containerRef}
      onMouseDown={startDrag}
      onTouchStart={startDrag}
      onMouseMove={handleDrag}
      onTouchMove={handleDrag}
      onMouseUp={stopDrag}
      onTouchEnd={stopDrag}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img src={rightImage} alt={rightLabel} className="slider-img slider-img--right" />
      <div
        className="slider-img slider-img--left"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          pointerEvents: 'none',
          clipPath: `inset(0 ${100 - sliderPos}% 0 0)`
        }}
      >
        <img
          src={leftImage}
          alt={leftLabel}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
        />
      </div>
      <div className="slider-bar" style={{ left: `${sliderPos}%` }}>
        <div className="slider-handle" />
      </div>
      <div
        className={`slider-label slider-label--left px-4 py-1 font-mono text-xs rounded-full border-2 transition-all duration-200
          ${sliderPos > 50
            ? 'bg-accent text-black border-accent font-extrabold shadow-lg drop-shadow-lg'
            : 'bg-black/80 text-white/70 border-white/20 opacity-50'}
        `}
        style={{ opacity: sliderPos > 10 ? 1 : 0.3 }}
      >
        {leftLabel}
      </div>
      <div
        className={`slider-label slider-label--right px-4 py-1 font-mono text-xs rounded-full border-2 transition-all duration-200
          ${sliderPos < 50
            ? 'bg-accent text-black border-accent font-extrabold shadow-lg drop-shadow-lg'
            : 'bg-black/80 text-white/70 border-white/20 opacity-50'}
        `}
        style={{ opacity: sliderPos < 90 ? 1 : 0.3 }}
      >
        {rightLabel}
      </div>
    </div>
  );
}
