import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { readArticles } from '@/lib/work';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/business', '/journey', '/work'].map((route) => ({
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
  return [...pages, ...articles];
}
