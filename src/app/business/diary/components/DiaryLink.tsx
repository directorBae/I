import type { ReactNode } from 'react';

export const DiaryLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <a
    href={href}
    {...(/^https?:/.test(href)
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {})}
  >
    {children}
  </a>
);
