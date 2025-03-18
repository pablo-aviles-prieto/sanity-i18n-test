/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

type SlideView = {
  name: string;
  photoPath: string | null;
};

const slideViews: SlideView[] = [
  { name: 'Irving penn: Centennial', photoPath: '/assets/irving-penn-centenial.jpg' },
  { name: 'The talks', photoPath: null },
  { name: 'The bookstore', photoPath: null },
];

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  // const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const updateViewport = () => {
      console.log('window', window);
      setViewportWidth(window.innerWidth);
      // setViewportHeight(window.innerHeight);
    };

    // Set the initial viewport size
    updateViewport();

    // Listen for resize events to update the viewport size dynamically
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Transform logo height from full height to small as scroll progresses
  const logoHeight = useTransform(scrollYProgress, [0, 0.15], ['50rem', '10rem']);

  // Translate the whole slides container
  const slidesTotalWidthPx = 868 * slideViews.length; // Each slide is 868px
  const xTranslate = useTransform(
    scrollYProgress,
    [0, 1],
    [`${viewportWidth}px`, `-${slidesTotalWidthPx}px`]
  );

  return (
    <div ref={containerRef} className='relative h-[600vh]'>
      {/* Fixed header with logo */}
      <motion.div
        className='fixed w-screen top-0 left-8 pt-14 z-10 mix-blend-difference'
        style={{ height: logoHeight }}
      >
        <motion.img
          src='/assets/mop.svg'
          alt='logo'
          className='h-full transition-all duration-300'
        />
      </motion.div>

      {/* Horizontal scroll container */}
      <div className='sticky top-0 h-screen w-full overflow-hidden flex items-center'>
        <motion.div className='flex' style={{ x: xTranslate }}>
          {slideViews.map(slide => (
            <SlideView key={slide.name} {...slide} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function SlideView({ name, photoPath }: SlideView) {
  return (
    <div className='border-l border-white h-screen w-[868px] flex-shrink-0 bg-black flex items-center justify-center'>
      {photoPath ? (
        <img src={photoPath} alt={name} className='w-full h-full object-cover' />
      ) : (
        <h1 className='text-white text-4xl'>{name}</h1>
      )}
    </div>
  );
}
