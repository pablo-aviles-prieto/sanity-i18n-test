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
const PEEK_PERCENTAGE = 0.1;

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

  // TODO: Remove it, used for debugging since it triggers the remount on the children
  useMotionValueEvent(scrollYProgress, 'change', latest => {
    setScrollProgress(latest);
  });

  const dynamicLogoHeight = useTransform(scrollYProgress, [0, 0.15], ['50rem', '10rem']);

  const percentAssignedBySlide = 1 / slideViews.length;
  const totalScrollablePx = SLIDE_WIDTH_IN_PX * slideViews.length;

  return (
    // Modify the height of the container to change the speed of the animation based on scroll
    <div ref={containerRef} className='relative' style={{ height: `${slideViews.length * 50}vh` }}>
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
            percentAssignedBySlide={percentAssignedBySlide}
            // totalSlides={slideViews.length}
            scrollPercentProgress={scrollPercentProgress}
            scrollYProgress={scrollYProgress}
            totalScrollablePx={totalScrollablePx}
            // slidesTotalWidthPx={slidesTotalWidthPx}
            // scrolledPixels={scrolledPixels}
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
  scrollPercentProgress: number;
  totalScrollablePx: number;
  percentAssignedBySlide: number;
  scrollYProgress: MotionValue<number>;
}

function SlideView({
  name,
  photoPath,
  index,
  viewportWidth,
  // scrolledPixels,
  scrollPercentProgress,
  scrollYProgress,
  // slidesTotalWidthPx,
  // totalSlides,
  percentAssignedBySlide,
  totalScrollablePx,
  bgColor,
}: SlideProps) {
  const totalPixelsMovedPerSlide = viewportWidth + SLIDE_WIDTH_IN_PX;
  const slidePercentBasedOnHisOwnTranslate = SLIDE_WIDTH_IN_PX / totalPixelsMovedPerSlide;
  const extrapolatedSlidePercent = slidePercentBasedOnHisOwnTranslate * percentAssignedBySlide;
  const percentOfSlideExtrapolated = extrapolatedSlidePercent * PEEK_PERCENTAGE;

  const baseOffset = (index - 1) * extrapolatedSlidePercent;

  // const correctedPercentAssignedBySlide = (1 - totalLostScrollPercent) / totalSlides;

  const translate =
    index === 0
      ? {
          input: [0, percentAssignedBySlide],
          output: [0, -totalPixelsMovedPerSlide],
        }
      : {
          input: [
            baseOffset + percentOfSlideExtrapolated,
            baseOffset + percentOfSlideExtrapolated * 2,
            baseOffset + extrapolatedSlidePercent + percentOfSlideExtrapolated,
            baseOffset + percentAssignedBySlide + extrapolatedSlidePercent,
          ],
          output: [
            0,
            -(SLIDE_WIDTH_IN_PX * PEEK_PERCENTAGE),
            -(SLIDE_WIDTH_IN_PX * PEEK_PERCENTAGE),
            -totalPixelsMovedPerSlide,
          ],
        };

  console.log('translate', index, translate.input, translate.output);
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
        <div className='w-full h-full relative'>
          <img src={photoPath} alt={name} className='w-full h-full object-cover' />
          <div className='absolute top-0 left-0 text-red-200 text-left text-xs'>
            {(scrollYProgress.get() * 100).toFixed(2)}%
            <br />
            {translateX.get().toFixed(0)}px
          </div>
          <div className='absolute top-0 left-1/2 text-red-200 text-left text-xs'>
            {(scrollYProgress.get() * 100).toFixed(2)}%
            <br />
            {translateX.get().toFixed(0)}px
          </div>
          <div className='absolute top-0 right-0 text-red-200 text-left text-xs'>
            {(scrollYProgress.get() * 100).toFixed(2)}%
            <br />
            {translateX.get().toFixed(0)}px
          </div>
        </div>
      ) : (
        <div className='w-full h-full text-center relative'>
          {/* <h1 className='text-white text-4xl'>{name}</h1> */}
          <div className='absolute top-0 left-0 text-white text-left text-xs'>
            {(scrollYProgress.get() * 100).toFixed(2)}%
            <br />
            {translateX.get().toFixed(0)}px
          </div>
          <div className='absolute top-0 left-1/2 text-white text-left text-xs'>
            {(scrollYProgress.get() * 100).toFixed(2)}%
            <br />
            {translateX.get().toFixed(0)}px
          </div>
          <div className='absolute top-0 right-0 text-white text-left text-xs'>
            {(scrollYProgress.get() * 100).toFixed(2)}%
            <br />
            {translateX.get().toFixed(0)}px
          </div>
        </div>
      )}
    </motion.div>
  );
}
