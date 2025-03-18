'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { unstable_ViewTransition as ViewTransition } from 'react';

export const PageTransitionWrapper = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname();
  const [delayedChildren, setDelayedChildren] = useState<React.ReactNode>(null);

  useEffect(() => {
    setDelayedChildren(null);
    const timeout = setTimeout(() => {
      setDelayedChildren(children);
    }, 400);

    return () => clearTimeout(timeout);
  }, [children, pathname]);

  return (
    <ViewTransition name='page'>
      <div />
      <main className='pt-14'>{delayedChildren}</main>
    </ViewTransition>
  );
};
