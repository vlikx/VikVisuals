import React from 'react';
import { motion } from 'framer-motion';
import ImageCompareSlider from './ImageCompareSlider';

export default function MouseMousepadComparison() {
  // These paths should match your Vite static import resolution
  const real = new URL('../assets/projects/Mouse + Mousepad 3D Render/Real.png', import.meta.url).href;
  const render = new URL('../assets/projects/Mouse + Mousepad 3D Render/Render.png', import.meta.url).href;

  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-full relative">
        <ImageCompareSlider leftImage={real} rightImage={render} leftLabel="Real Photo" rightLabel="3D Render" />
        <div className="flex flex-row items-center ml-2 select-none gap-2 absolute top-1/2 right-0 translate-x-[2rem] -translate-y-1/2" style={{opacity: 1, zIndex: 10}}>
          <motion.div
            className="flex flex-row items-center"
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-16 h-px bg-gradient-to-r from-white/30 to-transparent"></div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Slide</span>
          </motion.div>
        </div>
      </div>
      <div className="h-12 md:h-16" />
    </div>
  );
}
