import BusinessData from "@public/jsons/business/business.json";

export const BusinessBackCard = () => {
  return (
    <div className="flex translate-y-1/2 justify-center items-center flex-col gap-2 lg:gap-5">
      <div className="bg-black w-full h-4 lg:h-6 xl:h-8" />
      <div className="text-[#242424] font-black text-sm md:text-xl lg:text-2xl w-full text-left pl-2 lg:pl-5">
        {BusinessData.backCard.title}
      </div>
      <div className="text-[#242424] font-black text-sm md:text-xl lg:text-2xl w-full text-left pl-2 lg:pl-5">
        {BusinessData.backCard.subtitle}
      </div>
      <div className="text-[#242424] font-medium text-xs md:text-lg lg:text-xl w-full text-left whitespace-pre-wrap pl-2 pr-4 lg:pl-5 lg:pr-8">
        {BusinessData.backCard.context}
      </div>
      <div className="bg-black w-full h-4 lg:h-6 xl:h-8" />
    </div>
  );
};
