/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from 'motion/react';

type SlideView = {
  name: string;
  photoPath: string | null;
  bgColor: string;
};

const SLIDE_WIDTH_IN_PX = 868;
const PEEK_PERCENTAGE = 0.2; // 10% peek

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
    // { name: 'The bookstore', photoPath: null, bgColor: 'green' },
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

  useMotionValueEvent(scrollYProgress, 'change', latest => {
    setScrollProgress(latest);
  });

  const dynamicLogoHeight = useTransform(scrollYProgress, [0, 0.15], ['50rem', '10rem']);

  const slidesTotalWidthPx = SLIDE_WIDTH_IN_PX * slideViews.length; // Each slide is 868px
  const totalScrollablePx = slidesTotalWidthPx + viewportWidth * 2;
  const scrolledPixels = scrollPercentProgress * totalScrollablePx;

  return (
    <div ref={containerRef} className='relative h-[600vh]'>
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
      <div className='sticky top-0 h-screen w-full overflow-hidden'>
        {slideViews.map((slide, i) => (
          <SlideView
            key={slide.name}
            {...slide}
            index={i}
            totalSlides={slideViews.length}
            scrollPercentProgress={scrollPercentProgress}
            scrollYProgress={scrollYProgress}
            totalScrollablePx={totalScrollablePx}
            slidesTotalWidthPx={slidesTotalWidthPx}
            scrolledPixels={scrolledPixels}
            viewportWidth={viewportWidth}
          />
        ))}
      </div>
    </div>
  );
}

interface SlideProps extends SlideView {
  index: number;
  viewportWidth: number;
  scrolledPixels: number;
  scrollPercentProgress: number;
  slidesTotalWidthPx: number;
  totalSlides: number;
  totalScrollablePx: number;
  scrollYProgress: MotionValue<number>;
}

function SlideView({
  name,
  photoPath,
  index,
  viewportWidth,
  scrolledPixels,
  scrollPercentProgress,
  scrollYProgress,
  slidesTotalWidthPx,
  totalScrollablePx,
  bgColor,
  totalSlides,
}: SlideProps) {
  const percentAssignedBySlide = 0.25;
  // const peekPercentagePerAssignedPercent = percentAssignedBySlide * PEEK_PERCENTAGE;
  const totalTranslatePixelsPerSlide = viewportWidth + SLIDE_WIDTH_IN_PX;
  const slidePeekPixels = PEEK_PERCENTAGE * SLIDE_WIDTH_IN_PX;

  const slidePeekPercentageOfTotalScroll = slidePeekPixels / totalScrollablePx;
  const slidePercentageOfSectionSlideScroll = SLIDE_WIDTH_IN_PX / totalScrollablePx;

  const percentEquivalent = totalTranslatePixelsPerSlide / totalScrollablePx;
  const testv2 = slidePercentageOfSectionSlideScroll - slidePeekPercentageOfTotalScroll;
  console.log('percentEquivalent', percentEquivalent);
  console.log('testv2', testv2);

  const translate =
    index === 0
      ? {
          input: [0, percentAssignedBySlide],
          output: [0, -totalTranslatePixelsPerSlide],
        }
      : {
          input: [
            0,
            0 + slidePeekPercentageOfTotalScroll,
            0 + slidePeekPercentageOfTotalScroll * 2,
            0 + testv2,
            testv2 + percentAssignedBySlide - slidePeekPercentageOfTotalScroll,
          ],
          output: [0, 0, -slidePeekPixels, -slidePeekPixels, -totalTranslatePixelsPerSlide],
        };
  console.log('translate', index, translate.input, translate.output);
  console.log('scrollPercentProgress', scrollPercentProgress);
  // console.log('slidePercentageOfSectionSlideScroll', slidePercentageOfSectionSlideScroll);

  const translateX = useTransform(scrollYProgress, translate.input, translate.output);

  return (
    <motion.div
      className='absolute border-l border-white h-screen flex items-center justify-center'
      style={{
        left: `${viewportWidth}px`,
        backgroundColor: bgColor,
        x: translateX,
        zIndex: 10 + index,
        width: SLIDE_WIDTH_IN_PX,
      }}
    >
      {photoPath ? (
        <img src={photoPath} alt={name} className='w-full h-full object-cover' />
      ) : (
        <h1 className='text-white text-4xl'>{name}</h1>
      )}
    </motion.div>
  );
}
