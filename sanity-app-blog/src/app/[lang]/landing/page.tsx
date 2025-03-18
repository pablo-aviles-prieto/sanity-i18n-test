'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Transform logo height from full height to small as scroll progresses
  const logoHeight = useTransform(scrollYProgress, [0, 0.15], ['50rem', '10rem']);

  return (
    <div ref={containerRef} className='relative h-[400vh]'>
      {/* Fixed header with logo */}
      <motion.div
        className='fixed top-0 left-8 w-full pt-14 z-10 mix-blend-difference'
        style={{ height: logoHeight }}
      >
        <motion.img
          src='/assets/mop.svg'
          alt='logo'
          className='h-full transition-all duration-300'
        />
      </motion.div>

      {/* Horizontal scroll container */}
      <div className='sticky top-0 h-screen w-full overflow-hidden'>
        <motion.div className='flex h-screen'>
          {slideViews.map((slide, index) => (
            <SlideReveal
              key={slide.name}
              index={index}
              scrollYProgress={scrollYProgress}
              slide={slide}
              totalSlides={slideViews.length}
            />
          ))}
        </motion.div>
      </div>

      {/* Form section that appears after all slides */}
      {/* <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
        <div className='w-full max-w-md p-8 bg-black text-white rounded-lg'>
          <h2 className='text-2xl mb-6'>Contact Form</h2>
          <form className='space-y-4'>
            <div>
              <label className='block mb-2'>Name</label>
              <input type='text' className='w-full p-2 bg-gray-800 rounded' />
            </div>
            <div>
              <label className='block mb-2'>Email</label>
              <input type='email' className='w-full p-2 bg-gray-800 rounded' />
            </div>
            <div>
              <label className='block mb-2'>Message</label>
              <textarea className='w-full p-2 bg-gray-800 rounded h-32'></textarea>
            </div>
            <button className='bg-white text-black px-4 py-2 rounded'>Submit</button>
          </form>
        </div>
      </div> */}
    </div>
  );
}

interface SlideRevealProps {
  index: number;
  scrollYProgress: MotionValue<number>;
  slide: SlideView;
  totalSlides: number;
}

// Component for each slide that controls its reveal and horizontal position
function SlideReveal({ index, scrollYProgress, slide, totalSlides }: SlideRevealProps) {
  // Calculate when this slide should start appearing (staggered)
  const startPoint = index * 0.2; // Spread out the start points
  const endPoint = startPoint + 0.3; // Duration of the complete reveal

  // Control x position - slide enters from right (100vw) to its final position
  const x = useTransform(
    scrollYProgress,
    [startPoint, startPoint + 0.05, endPoint - 0.05, endPoint],
    ['100vw', '90vw', '10vw', '0vw']
  );

  // Control when previous slides exit to the left
  const xExit = useTransform(scrollYProgress, [endPoint, endPoint + 0.1], ['0vw', '-100vw']);

  // Combine transforms without conditional hooks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const combinedX = useTransform(scrollYProgress, (value: any) => {
    // Only apply exit animation if this isn't the last slide
    if (index < totalSlides - 1 && value > endPoint + 0.1) {
      return xExit.get();
    } else {
      return x.get();
    }
  });

  return (
    <motion.div
      className='min-h-screen w-[54rem] flex-shrink-0 bg-black flex items-center justify-center'
      style={{ x: combinedX }}
    >
      {slide.photoPath ? (
        <img src={slide.photoPath} alt={slide.name} className='w-full h-full object-cover' />
      ) : (
        <h1 className='text-white text-4xl'>{slide.name}</h1>
      )}
    </motion.div>
  );
}
