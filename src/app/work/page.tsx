import { GraphStateProvider } from '@/context/GraphContext';
import { headers } from 'next/headers';
import { MobileWork } from '@/components/ui/layout/mobileWorkView';
import { Title } from '@/components/ui/base/Title';
import { WorkScene } from './components/WorkScene';

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
