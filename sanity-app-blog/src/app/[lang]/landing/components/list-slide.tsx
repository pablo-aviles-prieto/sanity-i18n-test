/* eslint-disable @next/next/no-img-element */
import { SLIDE_WIDTH_IN_PX, SlideView } from '@/app/[lang]/landing/page';
import { MotionValue } from 'motion';
import { useTransform, motion } from 'motion/react';

interface ListSlideProps {
  viewportWidth: number;
  scrollPercentProgress: number;
  // totalScrollablePx: number;
  slideViews: SlideView[];
  scrollYProgress: MotionValue<number>;
}

export function ListSlide({
  scrollYProgress,
  viewportWidth,
  slideViews,
  scrollPercentProgress,
}: ListSlideProps) {
  const borders = slideViews.length; // having in mind the 1px of the left border of each slide
  const totalPixelsToMove = SLIDE_WIDTH_IN_PX * slideViews.length + borders;
  const translateX = useTransform(scrollYProgress, [0, 1], [viewportWidth, -totalPixelsToMove]);

  console.log('scrscrolscrollPercentProgresslPercentProgressollYProgress', scrollPercentProgress);

  return (
    <motion.div className='fixed w-screen flex' style={{ x: translateX }}>
      {slideViews.map(slide => (
        <div
          key={slide.name}
          className='flex items-center justify-center text-white border-l border-white'
          style={{ backgroundColor: slide.bgColor }}
        >
          {slide.photoPath ? (
            <div className='w-full h-full relative' style={{ width: SLIDE_WIDTH_IN_PX }}>
              <img src={slide.photoPath} alt={slide.name} className='w-full h-full object-cover' />
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
            <div
              className='w-full h-full text-center relative'
              style={{ width: SLIDE_WIDTH_IN_PX }}
            >
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
        </div>
      ))}
    </motion.div>
  );
}
