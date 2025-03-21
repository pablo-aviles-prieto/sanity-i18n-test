'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { ListSlide } from '@/app/[lang]/landing/components/list-slide';
import { FormSlide } from '@/app/[lang]/landing/components/form-slide';

export type SlideView = {
  name: string;
  photoPath: string | null;
  bgColor: string;
};

export const SLIDE_WIDTH_IN_PX = 868;
export const PEEK_PERCENTAGE = 0.1;
export const PX_HEIGHT_ASSIGNED_PER_SLIDE = 500;

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  const slideViews: SlideView[] = [
    {
      name: 'Irving penn: Centennial',
      photoPath: '/assets/irving-penn-centenial.jpg',
      bgColor: '',
    },
    { name: 'The talks', photoPath: null, bgColor: 'olive' },
    { name: 'The bookstore', photoPath: null, bgColor: 'green' },
    { name: 'The bookstore v2', photoPath: null, bgColor: 'blueviolet' },
    { name: 'The bookstore v3', photoPath: null, bgColor: 'brown' },
    { name: 'The bookstore v4', photoPath: null, bgColor: 'darkblue' },
    { name: 'The bookstore v5', photoPath: null, bgColor: 'darkorange' },
  ];

  useEffect(() => {
    const updateViewport = () => {
      setViewportWidth(window.innerWidth);
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

  const lazyScrollProgress = useSpring(scrollYProgress, {
    stiffness: 50, // Lower = more delay
    damping: 20, // Higher = smoother stop
    mass: 1.05, // Higher = more inertia effect
    restDelta: 0.0001, // More precision at the end of animation
    restSpeed: 0.00001, // Lower threshold for considering animation "at rest"
  });

  const dynamicLogoHeight = useTransform(lazyScrollProgress, [0, 0.15], ['50rem', '10rem']);

  return (
    // Modify the height of the container to change the speed of the animation based on scroll
    <div
      ref={containerRef}
      className='relative bg-white'
      style={{ height: `${Math.max(slideViews.length * 100, 150)}vh` }}
    >
      {/* Fixed header with logo */}
      <motion.div
        className='fixed w-screen top-0 pl-14 pt-14 z-10 mix-blend-difference'
        style={{ height: dynamicLogoHeight }}
      >
        <motion.img
          src='/assets/mop.svg'
          alt='logo'
          className='h-full transition-all duration-300'
        />
      </motion.div>

      {/* Horizontal scroll container */}
      <ListSlide
        slideViews={slideViews}
        scrollYProgress={lazyScrollProgress}
        viewportWidth={viewportWidth}
      />
      <FormSlide scrollYProgress={lazyScrollProgress} viewportWidth={viewportWidth} />
    </div>
  );
}
