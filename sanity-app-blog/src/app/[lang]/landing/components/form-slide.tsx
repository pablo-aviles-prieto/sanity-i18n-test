import { motion, MotionValue, useTransform } from 'motion/react';

interface FormSlideProps {
  viewportWidth: number;
  scrollYProgress: MotionValue<number>;
}

// TODO: Test in case there are 0 or just 1 slide!?!?!?
export const FormSlide = ({ viewportWidth, scrollYProgress }: FormSlideProps) => {
  const translateOpts = { input: [0, 1], output: [viewportWidth, 0] };
  const translateX = useTransform(scrollYProgress, translateOpts.input, translateOpts.output);

  return (
    <motion.div
      className={`bg-white fixed h-screen w-screen flex items-center justify-center text-black`}
      style={{ x: translateX }}
    >
      <div className='w-full h-full relative flex items-center justify-center'>FORM</div>
    </motion.div>
  );
};
