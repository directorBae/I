import Link from 'next/link';
import type { CSSProperties } from 'react';
import News from '@public/jsons/news/news.json';
import styles from './news.module.css';

type NewsItem = {
  title: string;
  summary: string;
  workId: number | null;
  download: string;
};

// Each new product rides its own meteor trail out of the cube.
const angles = [-24, 16, -56, 44];

export const MeteorNews = () => {
  const items = (News as NewsItem[]).slice(0, angles.length);
  if (!items.length) return null;
  return (
    <ul className={styles.news} aria-label="새로 만든 것들">
      {items.map((item, index) => (
        <li
          key={item.title}
          className={styles.item}
          style={
            {
              '--angle': `${angles[index]}deg`,
              '--delay': `${index * 1.1}s`,
            } as CSSProperties
          }
        >
          <span className={styles.trail} aria-hidden="true" />
          <article className={styles.card}>
            <span className={styles.badge}>New</span>
            <h2 className={styles.title}>{item.title}</h2>
            <p className={styles.summary}>{item.summary}</p>
            <div className={styles.links}>
              {item.workId !== null && (
                <Link href={`/work?id=${item.workId}`}>Work에서 보기 →</Link>
              )}
              {item.download && (
                <a href={item.download} download>
                  다운로드 ↓
                </a>
              )}
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
};
