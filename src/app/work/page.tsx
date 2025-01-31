//contentId -> content
import { Suspense } from "react";
import GraphComponent from "@/components/ui/graphs/visualizeGraphs";
import { Title } from "@/components/ui/base/Title";
import { Article, HoverArticle } from "./components/article";
import LoadingSpinner from "@/components/ui/assets/clipLoader";

interface WorkPageProps {
  searchParams: Promise<{ id: string }>;
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const { id: selectedId } = await searchParams;

  return (
    <div className="w-screen h-screen relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[url(/imgs/backgroundspace.png)] bg-cover bg-center" />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10" />
      <div className="absolute flex p-12 w-screen h-screen flex-col gap-2 z-30">
        <Title text="Work" />
        <div className="flex justify-center items-center">
          <GraphComponent />
        </div>
        {selectedId && (
          <Suspense fallback={<LoadingSpinner />}>
            <Article id={selectedId} />
          </Suspense>
        )}
        <Suspense>
          <HoverArticle />
        </Suspense>
      </div>
    </div>
  );
}
