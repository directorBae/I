//contentId -> content
import { Suspense } from "react";
import GraphComponent from "@/components/ui/graphs/visualizeGraphs";
import { Title } from "@/components/ui/base/Title";
import { Article } from "./components/article";
import { HoverArticle } from "./components/hover";
import LoadingSpinner from "@/components/ui/assets/clipLoader";
import { GraphStateProvider } from "@/context/GraphContext";
import Link from "next/link";

interface WorkPageProps {
  searchParams: Promise<{ id: string }>;
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const { id: selectedId } = await searchParams;

  return (
    <GraphStateProvider>
      <div className="w-screen h-screen relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url(/imgs/backgroundspace.png)] bg-cover bg-center" />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10" />
        <div className="absolute flex p-12 w-screen h-screen flex-col gap-2 z-30">
          <Title text="Work" />
          <div className="flex justify-center items-center">
            <GraphComponent />
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <Article id={selectedId} />
          </Suspense>
          <Suspense>
            <HoverArticle />
          </Suspense>
        </div>
      </div>
    </GraphStateProvider>
  );
}
