import fs from 'fs';
import path from 'path';
import type { ContentType } from '@/types/types';

const dir = path.join(process.cwd(), 'public/jsons/work/articles');

export function readArticles(): ContentType[] {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json') && file !== 'template.json')
    .map(
      (file) =>
        JSON.parse(
          fs.readFileSync(path.join(dir, file), 'utf-8'),
        ) as ContentType,
    );
}

export function readArticle(id: string): ContentType | null {
  if (!/^\d+$/.test(id)) return null;
  return readArticles().find((row) => String(row.id) === id) ?? null;
}

// First prose paragraph of an article, without markdown, for meta descriptions.
export function summarize(content: string, limit = 150): string {
  const paragraph =
    content
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .find((block) => block && !/^(#|-|\d+\.|```|>|!\[)/.test(block)) ?? '';
  const plain = paragraph
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > limit ? `${plain.slice(0, limit - 1)}…` : plain;
}
