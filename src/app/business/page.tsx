import { Title } from "@/components/ui/base/Title";
import BusinessData from "@public/jsons/business/business.json";
import { Context } from "@/components/ui/base/Context";
import { TitlePopup } from "@/components/ui/base/TitleDescriptionPopup";
import { Picture } from "@/components/ui/base/PictureTitle";
import HoneyBreaDPic from "@public/imgs/honeybread.png";
import { BusinessBackCard } from "./components/backCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "배정원 - Business / Bae Jeongwon's Business",
  description:
    "배정원, 그리고 창업에 대한 이야기   The story of Bae Jeongwon and entrepreneurship",
  keywords: [
    "배정원",
    "창업",
    "스타트업",
    "love__loper",
    "개발자",
    "1인창업",
    "Business",
    "Entrepreneurship",
    "Jeongwon",
    "Bae Jeongwon",
  ],
  authors: [
    {
      name: "Jeongwon Bae",
      // url: "https://yourwebsite.com"
    },
  ],
  openGraph: {
    title: "배정원 - Business / Bae Jeongwon's Business",
    description:
      "배정원, 그리고 창업에 대한 이야기   The story of Bae Jeongwon and entrepreneurship",
    url: "https://yourwebsite.com/business", // 페이지 URL
    siteName: "배정원", // 사이트 이름
    images: [
      {
        url: "/path-to-your-image.jpg", // 대표 이미지 경로
        width: 1200, // 이미지 너비
        height: 630, // 이미지 높이
        alt: "배정원 - 창업 이야기", // 이미지 설명
      },
    ],
    locale: "ko_KR", // 페이지 언어 및 지역
    type: "website",
  },
  twitter: {
    card: "summary_large_image", // Twitter 카드 타입
    title: "배정원 - Business / Bae Jeongwon's Business",
    description:
      "배정원, 그리고 창업에 대한 이야기   The story of Bae Jeongwon and entrepreneurship",
    images: ["/path-to-your-image.jpg"],
  },
  alternates: {
    canonical: "https://yourwebsite.com/business", // 정규 URL
    languages: {
      "ko-KR": "https://yourwebsite.com/ko/business",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export default function BusinessPage() {
  const text = "Business";

  return (
    <main className="md:max-w-[750px] xl:max-w-[1200px] w-full px-8 py-10 mx-auto flex flex-col justify-start gap-4 sm:gap-4 md:gap-8 lg:gap-12">
      <div className="hidden lg:block fixed z-10 left-7 w-8 xl:w-10">
        <Link href="/" className="cursor-pointer">
          <ArrowLeft size={"100%"} />
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
      <Context
        title={BusinessData.context1.title}
        description={BusinessData.context1.context}
      />
      <Context
        title={BusinessData.context2.title}
        description={BusinessData.context2.context}
      />
    </main>
  );
}
