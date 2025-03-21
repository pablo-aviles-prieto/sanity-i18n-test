import { Slide } from '@/app/[lang]/landing/components/slide';
import { SLIDE_WIDTH_IN_PX, SlideView } from '@/app/[lang]/landing/page';
import { MotionValue } from 'motion';
import { useTransform, motion } from 'motion/react';

interface ListSlideProps {
  viewportWidth: number;
  slideViews: SlideView[];
  scrollYProgress: MotionValue<number>;
}

export function ListSlide({ scrollYProgress, viewportWidth, slideViews }: ListSlideProps) {
  const lateralBorders: 0 | 1 | 2 = 1;
  const borders = lateralBorders * slideViews.length; // having in mind the 1px of the left border of each slide
  const totalPixelsToMove = SLIDE_WIDTH_IN_PX * slideViews.length + borders;
  const translateX = useTransform(scrollYProgress, [0, 1], [viewportWidth, -totalPixelsToMove], {});

  return (
    <motion.div className='fixed w-screen flex' style={{ x: translateX }}>
      {slideViews.map((slide, index) => (
        <Slide
          key={slide.name}
          {...slide}
          index={index}
          lateralBorders={lateralBorders}
          scrollYProgress={scrollYProgress}
          viewportWidth={viewportWidth}
          totalPixelsToMove={totalPixelsToMove}
        />
      ))}
    </motion.div>
  );
}
