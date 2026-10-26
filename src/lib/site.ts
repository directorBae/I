export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://baejeongwon.com'
).replace(/\/$/, '');

export const SITE_NAME = '배정원 · Bae Jeongwon';
export const SITE_DESCRIPTION =
  '스타트업에 미친 Entrepreneur이자 Engineer, 배정원의 개인 웹사이트. 창업 이야기(Business), 발자취(Journey), 만든 것들(Work)을 담았습니다.';
export const OG_IMAGE = {
  url: '/og.png',
  width: 1200,
  height: 630,
  alt: '배정원 · Bae Jeongwon',
};
// Child pages replace openGraph/twitter wholesale, so they carry the image too.
export function shareMetadata(
  title: string,
  description: string,
  url: string,
  type: 'website' | 'article' = 'website',
) {
  return {
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: 'ko_KR',
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export const SOCIAL_LINKS = [
  'https://github.com/directorBae',
  'https://www.linkedin.com/in/directorbae/',
  'https://www.instagram.com/garden_chirung/',
];
