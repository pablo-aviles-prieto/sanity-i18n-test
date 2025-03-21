'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { ListSlide } from '@/app/[lang]/landing/components/list-slide';

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
  const [scrollPercentProgress, setScrollProgress] = useState(0); // Track raw scroll progress

  const slideViews: SlideView[] = [
    {
      name: 'Irving penn: Centennial',
      photoPath: '/assets/irving-penn-centenial.jpg',
      bgColor: 'red',
    },
    { name: 'The talks', photoPath: null, bgColor: 'olive' },
    { name: 'The bookstore', photoPath: null, bgColor: 'green' },
    // { name: 'The bookstore v2', photoPath: null, bgColor: 'blueviolet' },
    { name: 'The bookstore v3', photoPath: null, bgColor: 'brown' },
    { name: 'The bookstore v4', photoPath: null, bgColor: 'darkblue' },
    // { name: 'The bookstore v5', photoPath: null, bgColor: 'darkorange' },
  ];

  // const enhancedViews: SlideView[] = [
  //   ...slideViews,
  //   {
  //     name: 'Form',
  //     photoPath: null,
  //     bgColor: 'darkred',
  //   },
  // ];

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

  /*
   ** There are some edge cases because the sneak peek animation of each slide
   ** provokes that each slide initiates and end much earlier than his assigned
   ** percentage of the scroll area. So the scroll animation finishes before the
   ** scroll reaches the end
   **
   ** To fix this, we have to tweak the offset end of the useScroll, having in mind that
   ** for more quantity of slides, the offset end should be higher since it increments
   ** the total scrollable area unused
   */
  // const { scrollYProgress } = useScroll({
  //   target: containerRef,
  //   offset: [
  //     'start start',
  //     slideViews.length > 2 ? `end ${PX_HEIGHT_ASSIGNED_PER_SLIDE}px` : 'end end',
  //   ],
  // });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // TODO: Remove it, used for debugging since it triggers the remount on the children
  useMotionValueEvent(scrollYProgress, 'change', latest => {
    setScrollProgress(latest);
  });

  const dynamicLogoHeight = useTransform(scrollYProgress, [0, 0.15], ['50rem', '10rem']);

  const percentAssignedBySlide = 1 / slideViews.length;
  // const totalScrollablePx = SLIDE_WIDTH_IN_PX * slideViews.length;

  return (
    // Modify the height of the container to change the speed of the animation based on scroll
    <div
      ref={containerRef}
      className='relative'
      // style={{
      //   height:
      //     slideViews.length >= 2
      //       ? `${slideViews.length * PX_HEIGHT_ASSIGNED_PER_SLIDE}px`
      //       : '120vh',
      // }}
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
      {/* <div className='sticky top-0 h-screen w-full overflow-hidden'>
        {enhancedViews.map((slide, i) => (
          <SlideView
            key={slide.name}
            {...slide}
            index={i}
            percentAssignedBySlide={percentAssignedBySlide}
            totalSlides={enhancedViews.length}
            scrollPercentProgress={scrollPercentProgress}
            scrollYProgress={scrollYProgress}
            // totalScrollablePx={totalScrollablePx}
            // slidesTotalWidthPx={slidesTotalWidthPx}
            // scrolledPixels={scrolledPixels}
            viewportWidth={viewportWidth}
          />
        ))}
      </div> */}

      <ListSlide
        slideViews={slideViews}
        scrollPercentProgress={scrollPercentProgress}
        scrollYProgress={scrollYProgress}
        viewportWidth={viewportWidth}
      />
    </div>
  );
}
