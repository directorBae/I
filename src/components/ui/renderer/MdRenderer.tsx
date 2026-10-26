import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { StarLink } from '@/app/work/components/StarLink';

interface Props {
  content: string;
}

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  return (
    <div className="prose max-w-none leading-[1.8]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ href, children }) => (
            <StarLink href={href || '#'}>{children}</StarLink>
          ),
          // Spans, not <figure>: markdown puts images inside a <p>.
          img: ({ src, alt }) => (
            <span className="md-figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={typeof src === 'string' ? src : ''} alt={alt || ''} loading="lazy" />
              {alt && <span className="md-caption">{alt}</span>}
            </span>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
