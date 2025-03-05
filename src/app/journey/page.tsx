import { Title } from '@/components/ui/base/Title';
import JourneyData from '@public/jsons/journey/journey.json';
import { Context } from '@/components/ui/base/Context';
import { TitlePopup } from '@/components/ui/base/TitleDescriptionPopup';
import { Picture } from '@/components/ui/base/PictureTitle';
import MongdolPic from '@public/imgs/mongdol.png';
import Texture from '@public/imgs/doltexture.png';
import { JourneyBackCard } from './components/backCard';
import Image from 'next/image';
import ArrowLeft from '@public/svgs/arrowleft.svg';
import Link from 'next/link';

export const metadata = {
  title: "배정원 - Journey / Bae Jeongwon's Journey",
  description:
    '배정원, 그리고 창업에 대한 이야기   The story of Bae Jeongwon and entrepreneurship',
  keywords: [
    '배정원',
    '여정',
    '여행',
    'CV',
    'Resume',
    '스타트업',
    '포트폴리오',
    'love__loper',
    'Journey',
    'Jeongwon',
    'Bae Jeongwon',
  ],
  authors: [
    {
      name: 'Jeongwon Bae',
      // url: "https://yourwebsite.com"
    },
  ],
  openGraph: {
    title: "배정원 - Journey / Bae Jeongwon's Journey",
    description: '배정원, 그리고 오고 갈 여행   The journey of Bae Jeongwon',
    url: 'https://yourwebsite.com/journey', // 페이지 URL
    siteName: '배정원', // 사이트 이름
    images: [
      {
        url: '/path-to-your-image.jpg', // 대표 이미지 경로
        width: 1200, // 이미지 너비
        height: 630, // 이미지 높이
        alt: '배정원 - 여행', // 이미지 설명
      },
    ],
    locale: 'ko_KR', // 페이지 언어 및 지역
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image', // Twitter 카드 타입
    title: "배정원 - Journey / Bae Jeongwon's Journey",
    description:
      '배정원, 그리고 창업에 대한 이야기   The story of Bae Jeongwon and entrepreneurship',
    images: ['/path-to-your-image.jpg'],
  },
  alternates: {
    canonical: 'https://yourwebsite.com/journey', // 정규 URL
    languages: {
      'ko-KR': 'https://yourwebsite.com/ko/journey',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export default function JourneyPage() {
  const text = 'Journey';

  return (
    <main className="md:max-w-[750px] xl:max-w-[1200px] w-full px-8 py-10 mx-auto flex flex-col justify-start gap-4 sm:gap-4 md:gap-8 lg:gap-12">
      <div className="hidden lg:block fixed z-10 left-7 w-8 xl:w-10">
        <Link href="/" className="cursor-pointer">
          <Image
            src={ArrowLeft}
            alt="link icon"
            style={{
              width: '100%',
            }}
          />
        </Link>
      </div>
      <div className="relative group">
        <Title
          text={text}
          hoverBg="hover:bg-[url('/imgs/doltexture.png')] bg-cover bg-center"
        />
        <div className="absolute z-10 md:translate-x-36 lg:translate-x-44 xl:translate-x-60 -translate-y-4 hidden group-hover:block">
          <TitlePopup
            title={JourneyData.popup.title}
            description={JourneyData.popup.context}
            image={<Image src={Texture} alt="dol" width={120} height={120} />}
          />
        </div>
      </div>
      <Picture imageSrc={MongdolPic} back={<JourneyBackCard />} />
      <Context
        title={JourneyData.context1.title}
        description={JourneyData.context1.context}
      />
    </main>
  );
}
