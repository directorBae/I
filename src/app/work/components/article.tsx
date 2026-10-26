'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useGraphState } from '@/context/GraphContext';
import SwipeHolder from '@public/svgs/swipeHolder.svg';
import MarkdownRenderer from '@/components/ui/renderer/MdRenderer';
import LoadingSpinner from '@/components/ui/assets/clipLoader';
import { StarLink } from './StarLink';
import styles from './work.module.css';

export const Article = ({ id }: { id: string | null }) => {
  const { contentsData, setHoveredNode, closeProject } = useGraphState();
  const scroll = useRef<HTMLDivElement>(null);
  const project = id ? contentsData?.[id] : null;
  useEffect(() => {
    scroll.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);
  const close = () => {
    if (id) setHoveredNode(id);
    closeProject();
  };
  return (
    <AnimatePresence>
      {id && (
        <motion.aside
          key="work-detail-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.4 }}
          className={styles.panel}
          aria-label={project?.title || '프로젝트 상세'}
        >
          <button
            type="button"
            className={styles.close}
            onClick={close}
            aria-label="별자리 전체 보기"
          >
            <Image src={SwipeHolder} alt="" />
          </button>
          <div ref={scroll} className={styles.scroll}>
            {project ? (
              <>
                <header className={styles.header}>
                  <h1 className={styles.title}>{project.title}</h1>
                </header>
                {(project.links.website || project.links.github) && (
                  <div className={styles.externalLinks}>
                    {project.links.website && (
                      <StarLink href={project.links.website}>Website</StarLink>
                    )}
                    {project.links.github && (
                      <StarLink href={project.links.github}>GitHub</StarLink>
                    )}
                  </div>
                )}
                <div className={styles.rule} />
                <article className={styles.body}>
                  <MarkdownRenderer content={project.content} />
                </article>
              </>
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
