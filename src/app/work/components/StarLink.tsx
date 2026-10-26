'use client';

import type { ReactNode, MouseEvent } from 'react';
import { useGraphState } from '@/context/GraphContext';
import styles from './work.module.css';

export function StarLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const { clickNode } = useGraphState();
  const project = /^\/work\?id=(\d+)$/.exec(href);
  const activate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      !project ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    clickNode(project[1]);
  };
  return (
    <a
      href={href}
      onClick={activate}
      className={styles.link}
      data-star-link="true"
      {...(!project && /^https?:/.test(href)
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
    >
      <svg
        className={styles.spark}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 0 15.2 8.8 24 12 15.2 15.2 12 24 8.8 15.2 0 12 8.8 8.8Z" />
      </svg>
      <span className={styles.linkText}>{children}</span>
    </a>
  );
}
