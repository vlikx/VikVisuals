import { motion } from 'framer-motion';

export default function AtlasButton({ 
  href = '#', 
  children = 'GET IN TOUCH',
  variant = 'default',
  className = '',
  onClick,
  type = 'button',
  as = 'a'
}) {
  // Create repeated text for seamless marquee
  const marqueeText = `${typeof children === 'string' ? children : 'BUTTON'} • `.repeat(8);

  const baseStyles = 'atlas-btn group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full text-sm font-medium uppercase tracking-widest transition-all duration-500';
  
  const variants = {
    default: 'border border-white/20 bg-transparent px-10 text-white hover:border-white/40 hover:bg-white hover:text-black',
    primary: 'border border-accent bg-accent px-10 text-white hover:bg-white hover:text-black hover:border-white',
    outline: 'border border-white/20 bg-transparent px-10 text-white hover:border-white/40 hover:bg-white hover:text-black',
    ghost: 'border border-transparent bg-transparent px-6 text-white hover:bg-white/10',
  };

  const Component = as === 'button' ? motion.button : motion.a;

  return (
    <Component
      href={as === 'a' ? href : undefined}
      onClick={onClick}
      type={as === 'button' ? type : undefined}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Default text */}
      <span className="relative z-10 transition-opacity duration-300 group-hover:opacity-0">
        {children}
      </span>

      {/* Marquee on hover */}
      <div
        className="absolute inset-0 flex items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      >
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="mx-4">{marqueeText}</span>
          <span className="mx-4">{marqueeText}</span>
        </div>
      </div>
    </Component>
  );
}
