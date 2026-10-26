import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '배정원 · Bae Jeongwon',
    short_name: '배정원',
    description: '창업가이자 엔지니어 배정원의 개인 웹사이트',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#101010',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
