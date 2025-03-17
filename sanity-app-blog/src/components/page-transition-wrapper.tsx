'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useTransition, unstable_useSwipeTransition } from 'react';
import { unstable_ViewTransition as ViewTransition } from 'react';

export const PageTransitionWrapper = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  // const pathname = usePathname();
  // const [isTransitioning, setIsTransitioning] = useState(false);
  // const transition = useTransition();

  // // Trigger transition when pathname changes
  // useEffect(() => {
  //   setIsTransitioning(true);
  //   const timer = setTimeout(() => {
  //     setIsTransitioning(false);
  //   }, 1200);

  //   return () => clearTimeout(timer);
  // }, [pathname]);

  return (
    <>
      <ViewTransition name='page'>
        <div className='view-transition-background' />
        {/* {isTransitioning && <div className='view-transition-background' />} */}
        {children}
      </ViewTransition>
    </>
    // <>
    //   {isTransitioning && <div className='view-transition-background' />}
    //   {children}
    // </>
  );
};
