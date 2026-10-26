import { Title } from '@/components/ui/base/Title';
import BusinessData from '@public/jsons/business/business.json';
import { Context } from '@/components/ui/base/Context';
import { TitlePopup } from '@/components/ui/base/TitleDescriptionPopup';
import { Picture } from '@/components/ui/base/PictureTitle';
import HoneyBreaDPic from '@public/imgs/honeybread.png';
import { BusinessBackCard } from './components/backCard';
import Image from 'next/image';
import ArrowLeft from '@public/svgs/arrowleft.svg';
import Link from 'next/link';
import { shareMetadata } from '@/lib/site';

const description =
  '배정원, 그리고 창업에 대한 이야기   The story of Bae Jeongwon and entrepreneurship';

export const metadata = {
  title: { absolute: "배정원 - Business / Bae Jeongwon's Business" },
  description,
  keywords: [
    '배정원',
    '창업',
    '스타트업',
    'love__loper',
    '개발자',
    '1인창업',
    'Business',
    'Entrepreneurship',
    'Jeongwon',
    'Bae Jeongwon',
  ],
  ...shareMetadata("배정원 - Business / Bae Jeongwon's Business", description, '/business'),
};

export default function BusinessPage() {
  const text = 'Business';

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
          hoverBg="hover:bg-gradient-to-r hover:to-[#FF9C06] hover:from-[#553300]"
        />
        <div className="absolute z-10 md:translate-x-36 lg:translate-x-44 xl:translate-x-60 -translate-y-4 hidden group-hover:block">
          <TitlePopup
            title={BusinessData.popup.title}
            description={BusinessData.popup.context}
            image={
              <div className="w-[120] h-[120] block bg-gradient-to-r to-[#FF9C06] from-[#553300] " />
            }
          />
        </div>
      </div>
      <Picture imageSrc={HoneyBreaDPic} back={<BusinessBackCard />} />
      {BusinessData.contexts.map((section) => (
        <Context
          key={section.title}
          title={section.title}
          description={section.context}
        />
      ))}
    </main>
  );
}
