import { SNSButton } from "@/components/ui/base/SNSButton";
import { ContactInfo } from "@/components/ui/base/ContactInfo";
import { D3Section } from "@/components/transition/3d/section";
import { headers } from "next/headers";
import { MobileHomeGrid } from "../components/ui/layout/mobileHomeView";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SOCIAL_LINKS } from "@/lib/site";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "배정원",
      alternateName: ["Bae Jeongwon", "Jeongwon Bae"],
      url: SITE_URL,
      image: `${SITE_URL}/og.png`,
      jobTitle: "Entrepreneur & Engineer",
      description: SITE_DESCRIPTION,
      alumniOf: { "@type": "CollegeOrUniversity", name: "UNIST" },
      sameAs: SOCIAL_LINKS,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "ko-KR",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export default async function Home() {
  const userAgent = (await headers()).get("user-agent") || "";
  const isMobile = /iPhone|Android|iPad|Mobile/i.test(userAgent);

  return (
    <div className="flex p-12 h-screen flex-col gap-2 bg-[#fafafa]">
      <div
        id="hover-effect"
        className="absolute inset-0 pointer-events-none"
        style={{
          transition: "background 0.1s",
        }}
      />
      <h1
        className="
        text-3xl md:text-5xl lg:text-7xl font-black text-[#242424] cursor-default
      "
      >
        {"배정원"}
      </h1>
      <div className="h-2 md:h-4 w-full lock" />
      <ContactInfo phone="010   7475   0682" email="bjw020615   unist ac kr" />
      {isMobile ? <MobileHomeGrid /> : <D3Section />}
      <div className="mt-auto">
        <SNSButton />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('mousemove', function(e) {
              const effectLayer = document.getElementById('hover-effect');
              if (!effectLayer) return;

              const x = e.clientX;
              const y = e.clientY;

              effectLayer.style.background = \`radial-gradient(circle at \${x}px \${y}px, rgba(255, 255, 255, 0.8) 0%, transparent 10%)\`;
            });
          `,
        }}
      />
    </div>
  );
}
