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
const PX_HEIGHT_ASSIGNED_PER_SLIDE = 500;

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
    // { name: 'The bookstore v2', photoPath: null, bgColor: 'blueviolet' },
    // { name: 'The bookstore v3', photoPath: null, bgColor: 'brown' },
    // { name: 'The bookstore v4', photoPath: null, bgColor: 'darkblue' },
    // { name: 'The bookstore v5', photoPath: null, bgColor: 'darkorange' },
  ];

  const enhancedViews: SlideView[] = [
    ...slideViews,
    {
      name: 'Form',
      photoPath: null,
      bgColor: 'darkred',
    },
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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: [
      'start start',
      slideViews.length > 2 ? `end ${PX_HEIGHT_ASSIGNED_PER_SLIDE}px` : 'end end',
    ],
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
      <div className='sticky top-0 h-screen w-full overflow-hidden'>
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
      </div>
    </div>
  );
}

interface SlideProps extends SlideView {
  index: number;
  viewportWidth: number;
  scrollPercentProgress: number;
  // totalScrollablePx: number;
  totalSlides: number;
  percentAssignedBySlide: number;
  scrollYProgress: MotionValue<number>;
}

function SlideView({
  name,
  photoPath,
  bgColor,
  index,
  viewportWidth,
  // scrolledPixels,
  scrollPercentProgress,
  scrollYProgress,
  totalSlides,
  percentAssignedBySlide,
  // totalScrollablePx,
}: SlideProps) {
  const totalPixelsMovedPerSlide = viewportWidth + SLIDE_WIDTH_IN_PX;
  const slidePercentBasedOnHisOwnTranslate = SLIDE_WIDTH_IN_PX / totalPixelsMovedPerSlide;
  const extrapolatedSlidePercent = slidePercentBasedOnHisOwnTranslate * percentAssignedBySlide;
  const percentOfSlideExtrapolated = extrapolatedSlidePercent * PEEK_PERCENTAGE;

  const lastBreakpoint = (totalSlides - 1) * extrapolatedSlidePercent + percentAssignedBySlide;
  console.log('percentAssignedBySlide', percentAssignedBySlide);

  // Lost percent that needs to be accounted for
  const totalAssigned = percentAssignedBySlide * totalSlides;
  const lostScrollPercent = totalAssigned - lastBreakpoint;
  const lostScrollPercentBySlide = lostScrollPercent / totalSlides;

  const baseOffset =
    index === 0
      ? lostScrollPercentBySlide
      : (index - 1) * extrapolatedSlidePercent + lostScrollPercentBySlide;

  /*
   ** There are some edge cases mainly because the sneak peek animation (mentioned earlier)
   ** provokes that the animation is finished before the scroll reaches the 100% of the scroll animation container
   ** This means, there are some tweaks in the offset of the useScroll, that provokes som edge cases in concrete
   ** amount of slides.
   ** Also the last slide (the form slide) has to be treated differently and checking is not being fucked up by
   ** the tweaks on the useScroll hook
   */
  const translate =
    totalSlides === 2 && index === 0 // Meaning only 1 slide plus form slide
      ? {
          input: [0, percentAssignedBySlide],
          output: [0, -totalPixelsMovedPerSlide],
        }
      : index === 0 // First slide
        ? {
            input: [lostScrollPercentBySlide, baseOffset + percentAssignedBySlide],
            output: [0, -totalPixelsMovedPerSlide],
          }
        : index !== totalSlides - 1 // Any slide but last
          ? {
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
            }
          : {
              // Last slide (form slide)
              input: [
                totalSlides === 2
                  ? percentOfSlideExtrapolated
                  : baseOffset + percentOfSlideExtrapolated,
                totalSlides === 2
                  ? 1
                  : baseOffset + percentAssignedBySlide + percentOfSlideExtrapolated,
              ],
              output: [0, -viewportWidth],
            };

  console.log('translate', index, translate.input, translate.output);
  console.log('scrollPercentProgress', scrollPercentProgress);
  const translateX = useTransform(scrollYProgress, translate.input, translate.output);

  if (index === totalSlides - 1) {
    return (
      <motion.div
        className='absolute w-screen border-l border-white h-screen flex items-center justify-center z-[1]'
        style={{
          // left: 0,
          left: `${viewportWidth}px`,
          backgroundColor: '#720000',
          x: translateX,
        }}
      >
        Motherfucking form
      </motion.div>
    );
  }

  return (
    <motion.div
      className='absolute border-l border-white h-screen flex items-center justify-center'
      style={{
        left: `${viewportWidth}px`,
        backgroundColor: bgColor,
        x: translateX,
        zIndex: index === totalSlides - 1 ? 9 : 10 + index,
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
