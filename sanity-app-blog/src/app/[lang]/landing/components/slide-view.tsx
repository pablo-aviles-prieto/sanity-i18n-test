/* eslint-disable @next/next/no-img-element */
import {
  PEEK_PERCENTAGE,
  SLIDE_WIDTH_IN_PX,
  SlideView as SlideViewProps,
} from '@/app/[lang]/landing/page';
import { MotionValue } from 'motion';
import { useTransform, motion } from 'motion/react';

interface SlideProps extends SlideViewProps {
  index: number;
  viewportWidth: number;
  scrollPercentProgress: number;
  // totalScrollablePx: number;
  totalSlides: number;
  percentAssignedBySlide: number;
  scrollYProgress: MotionValue<number>;
}

export function SlideView({
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
