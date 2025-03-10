'use client';

import { locales } from '@/lib/i18n';
import { usePathname, useRouter } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (newLocale: string) => {
    const segments = pathname.split('/').filter(Boolean); // Remove empty segments
    if (locales.some(lang => lang.locale === segments[0])) {
      segments[0] = newLocale; // Replace existing locale
    } else {
      segments.unshift(newLocale); // Add locale if missing
    }
    router.push(`/${segments.join('/')}`);
  };

  return (
    <section className='w-full min-h-12 px-10 flex justify-end items-center'>
      <div className='flex gap-x-4'>
        {locales.map(lang => (
          <button
            className='cursor-pointer'
            onClick={() => handleLocaleChange(lang.locale)}
            key={lang.locale}
          >
            {lang.icon}
          </button>
        ))}
      </div>
    </section>
  );
};
