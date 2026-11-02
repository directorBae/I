import { Title } from '@/components/ui/base/Title';
import Image from 'next/image';
import ArrowLeft from '@public/svgs/arrowleft.svg';
import Link from 'next/link';
import { shareMetadata } from '@/lib/site';
import { readDiary } from '@/lib/diary';

const description = '배정원의 일기장   The diary of Bae Jeongwon';

export const metadata = {
  title: { absolute: "배정원 - Diary / Bae Jeongwon's Diary" },
  description,
  keywords: ['배정원', '일기', '일기장', '창업', 'Diary', 'Bae Jeongwon'],
  ...shareMetadata("배정원 - Diary / Bae Jeongwon's Diary", description, '/business/diary'),
};

export default function DiaryPage() {
  const entries = readDiary();

  return (
    <main className="md:max-w-[750px] xl:max-w-[1200px] w-full px-8 py-10 mx-auto flex flex-col justify-start gap-4 sm:gap-4 md:gap-8 lg:gap-12">
      <div className="hidden lg:block fixed z-10 left-7 w-8 xl:w-10">
        <Link href="/business" className="cursor-pointer">
          <Image
            src={ArrowLeft}
            alt="link icon"
            style={{
              width: '100%',
            }}
          />
        </Link>
      </div>
      <Title
        text="Diary"
        hoverBg="hover:bg-gradient-to-r hover:to-[#FF9C06] hover:from-[#553300]"
      />
      <div className="h-px bg-black w-10" />
      {entries.length ? (
        <ul className="flex flex-col">
          {entries.map((entry) => (
            <li key={entry.slug}>
              <Link
                href={`/business/diary/${entry.slug}`}
                className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-4 lg:py-6 border-b border-[#24242422]"
              >
                <span className="text-xs sm:text-sm lg:text-base font-semibold text-[#24242488] tabular-nums shrink-0">
                  {entry.date}
                </span>
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-extrabold text-[#242424] group-hover:text-[#FF9C06] transition-colors duration-300">
                  {entry.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-[#24242488]">
          아직 쓴 일기가 없습니다.
        </div>
      )}
    </main>
  );
}
