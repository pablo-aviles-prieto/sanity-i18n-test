/* eslint-disable @next/next/no-img-element */
import {
  PEEK_PERCENTAGE,
  SLIDE_WIDTH_IN_PX,
  SlideView as SlideViewProps,
} from '@/app/[lang]/landing/page';
import { MotionValue, motion, useTransform } from 'motion/react';

interface SlideProps extends SlideViewProps {
  index: number;
  viewportWidth: number;
  totalPixelsToMove: number;
  scrollYProgress: MotionValue<number>;
  lateralBorders: 0 | 2 | 1;
}

export const Slide = ({
  name,
  photoPath,
  bgColor,
  index,
  viewportWidth,
  scrollYProgress,
  lateralBorders,
  totalPixelsToMove,
}: SlideProps) => {
  const sneakPeekSlideWidth = SLIDE_WIDTH_IN_PX * PEEK_PERCENTAGE;
  const startingTranslateX = index === 0 ? 0 : sneakPeekSlideWidth - SLIDE_WIDTH_IN_PX;

  const percentOfSlideFullyVisibleOnViewport =
    SLIDE_WIDTH_IN_PX / (totalPixelsToMove + viewportWidth);

  const percentOfSlideSneakPeekVisibleOnViewport =
    sneakPeekSlideWidth / (totalPixelsToMove + viewportWidth);

  const baseOffset = (index - 1) * percentOfSlideFullyVisibleOnViewport;

  const translateOpts =
    index === 0
      ? {
          input: [0],
          output: [0],
        }
      : {
          input: [
            baseOffset + percentOfSlideSneakPeekVisibleOnViewport * 2,
            baseOffset +
              percentOfSlideFullyVisibleOnViewport +
              percentOfSlideSneakPeekVisibleOnViewport,
          ],
          output: [startingTranslateX, 0],
        };

  const translateX = useTransform(scrollYProgress, translateOpts.input, translateOpts.output);

  return (
    <motion.div
      key={name}
      className={`flex items-center justify-center text-white border-l border-white ${lateralBorders === 1 ? 'border-l' : lateralBorders === 2 ? 'border-x' : ''}`}
      style={{ backgroundColor: bgColor, x: translateX, zIndex: 10 + index }}
    >
      {photoPath ? (
        <div className='w-full h-full relative' style={{ width: SLIDE_WIDTH_IN_PX }}>
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
        <div className='w-full h-full text-center relative' style={{ width: SLIDE_WIDTH_IN_PX }}>
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
};
