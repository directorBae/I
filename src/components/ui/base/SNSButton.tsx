import GithubIcon from "@public/svgs/github.svg";
import InstagramIcon from "@public/svgs/ig.svg";
import LinkedInIcon from "@public/svgs/linkedin.svg";
import Link from "next/link";
import Image from "next/image";

export const SNSButton = () => {
  return (
    <div className="flex flex-row justify-end items-center space-x-4 w-full">
      <Link href="https://github.com/directorBae" target="_blank">
        <Image
          src={GithubIcon}
          className="w-4 h-4 lg:w-8 lg:h-8"
          alt="github"
        />
      </Link>
      <Link href="https://www.linkedin.com/in/directorbae/" target="_blank">
        <Image
          src={LinkedInIcon}
          className="w-4 h-4 lg:w-10 lg:h-10"
          alt="linkedin"
        />
      </Link>
      <Link href="https://www.instagram.com/love__loper/" target="_blank">
        <Image
          src={InstagramIcon}
          className="w-4 h-4 lg:w-8 lg:h-8"
          alt="instagram"
        />
      </Link>
    </div>
  );
};
