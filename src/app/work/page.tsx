import { GraphStateProvider } from '@/context/GraphContext';
import { headers } from 'next/headers';
import { MobileWork } from '@/components/ui/layout/mobileWorkView';
import { Title } from '@/components/ui/base/Title';
import type { Metadata } from 'next';
import { WorkScene } from './components/WorkScene';
import { readArticle, summarize } from '@/lib/work';
import { shareMetadata } from '@/lib/site';

const workDescription =
  '배정원이 만든 프로젝트와 일을 별자리로 엮었습니다. 회사, 팀, 대회와 작업이 서로 이어져 있습니다.';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}): Promise<Metadata> {
  const { id } = await searchParams;
  const article = id ? readArticle(id) : null;
  if (!article)
    return {
      title: 'Work',
      description: workDescription,
      ...shareMetadata('Work | 배정원', workDescription, '/work'),
    };
  const description = summarize(article.content) || workDescription;
  return {
    title: `${article.title} · Work`,
    description,
    ...shareMetadata(
      `${article.title} | 배정원`,
      description,
      `/work?id=${article.id}`,
      'article',
    ),
  };
}

export default async function WorkPage() {
  const agent = (await headers()).get('user-agent') || '';
  const mobile = /iPhone|Android|iPad|Mobile/i.test(agent);
  return (
    <GraphStateProvider>
      {mobile ? (
        <div className="w-screen h-screen relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url(/imgs/backgroundspace.png)] bg-cover bg-center" />
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10" />
          <div className="absolute flex p-12 w-screen h-screen flex-col gap-2 z-30">
            <Title text="Work" />
            <MobileWork />
          </div>
        </div>
      ) : (
        <WorkScene />
      )}
    </GraphStateProvider>
  );
}
