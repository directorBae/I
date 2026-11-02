import fs from 'fs';
import path from 'path';
import type { DiaryType } from '@/types/types';

const dir = path.join(process.cwd(), 'public/jsons/business/diary');

// Newest first.
export function readDiary(): DiaryType[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json') && file !== 'template.json')
    .map((file) => ({
      ...(JSON.parse(
        fs.readFileSync(path.join(dir, file), 'utf-8'),
      ) as Omit<DiaryType, 'slug'>),
      slug: file.replace(/\.json$/, ''),
    }))
    .sort(
      (a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug),
    );
}

export function readDiaryEntry(slug: string): DiaryType | null {
  return readDiary().find((entry) => entry.slug === slug) ?? null;
}
