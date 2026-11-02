import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { readArticles } from '@/lib/work';
import { readDiary } from '@/lib/diary';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/business', '/business/diary', '/journey', '/work'].map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: 'monthly' as const,
    priority: route ? 0.8 : 1,
  }));
  const articles = readArticles()
    .sort((a, b) => a.id - b.id)
    .map((article) => ({
      url: `${SITE_URL}/work?id=${article.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  const diary = readDiary().map((entry) => ({
    url: `${SITE_URL}/business/diary/${entry.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));
  return [...pages, ...articles, ...diary];
}
