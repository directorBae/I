import Image from 'next/image';
import ArrowLeft from '@public/svgs/arrowleft.svg';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import MarkdownRenderer from '@/components/ui/renderer/MdRenderer';
import { shareMetadata } from '@/lib/site';
import { readDiary, readDiaryEntry } from '@/lib/diary';
import { summarize } from '@/lib/work';
import { DiaryLink } from '../components/DiaryLink';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return readDiary().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const entry = readDiaryEntry((await params).slug);
  if (!entry) return {};
  const description = summarize(entry.content) || '배정원의 일기장';
  return {
    title: `${entry.title} · Diary`,
    description,
    ...shareMetadata(
      `${entry.title} | 배정원`,
      description,
      `/business/diary/${entry.slug}`,
      'article',
    ),
  };
}

export default async function DiaryEntryPage({ params }: Params) {
  const entry = readDiaryEntry((await params).slug);
  if (!entry) notFound();

  return (
    <main className="md:max-w-[750px] xl:max-w-[1200px] w-full px-8 py-10 mx-auto flex flex-col justify-start gap-4 sm:gap-4 md:gap-8 lg:gap-12">
      <div className="hidden lg:block fixed z-10 left-7 w-8 xl:w-10">
        <Link href="/business/diary" className="cursor-pointer">
          <Image
            src={ArrowLeft}
            alt="link icon"
            style={{
              width: '100%',
            }}
          />
        </Link>
      </div>
      <header className="flex flex-col gap-2 lg:gap-4">
        <div className="text-xs sm:text-sm lg:text-base font-semibold text-[#24242488] tabular-nums">
          {entry.date}
        </div>
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-4xl xl:text-5xl font-black text-[#242424]">
          {entry.title}
        </h1>
      </header>
      <div className="h-px bg-black w-10" />
      <article className="mb-12 lg:mb-24">
        <MarkdownRenderer content={entry.content} link={DiaryLink} />
      </article>
    </main>
  );
}
