import Link from "next/link";

export const MobileHomeGrid = () => {
  return (
    <div
      className="
            grid grid-rows-3 items-center justify-items-center gap-4 h-full
        "
    >
      <Link href="/business">
        <div className="text-5xl font-black text-[#242424] text-center">B</div>
      </Link>
      <Link href="/journey">
        <div className="text-5xl font-black text-[#242424] text-center">J</div>
      </Link>
      <Link href="/work">
        <div className="text-5xl font-black text-[#242424] text-center">W</div>
      </Link>
    </div>
  );
};
