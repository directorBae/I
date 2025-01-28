import JourneyData from "@public/jsons/journey/journey.json";

export const JourneyBackCard = () => {
  return (
    <div className="flex translate-y-1/2 justify-center items-center flex-col gap-2 lg:gap-5">
      <div className="bg-black w-full h-4 lg:h-6 xl:h-8" />
      <div className="text-[#242424] font-black text-sm md:text-xl lg:text-2xl w-full text-left pl-2 lg:pl-5">
        {JourneyData.backCard.title}
      </div>
      <div className="text-[#242424] font-medium text-xs md:text-lg lg:text-xl w-full text-left whitespace-pre-wrap pl-2 pr-4 lg:pl-5 lg:pr-8">
        <div className="w-full aspect-video">
          <iframe
            width={"100%"}
            height={"100%"}
            src="https://www.youtube.com/embed/VEr8_NIoQq4?si=OlYEpkkpUfe7AYNN"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
      <div className="bg-black w-full h-4 lg:h-6 xl:h-8" />
    </div>
  );
};
