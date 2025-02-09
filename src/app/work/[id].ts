import fs from "fs";
import path from "path";
import { GetStaticPaths, GetStaticProps } from "next";
import { ContentType } from "@/types/types";
import WorkPage from "./page";

export const getStaticPaths: GetStaticPaths = async () => {
  const dir = path.join(process.cwd(), "public/jsons/work/articles");
  const files = fs.readdirSync(dir);
  const paths = files
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({
      params: { id: file.replace(".json", "") },
    }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params!;
  const filePath = path.join(
    process.cwd(),
    "public/jsons/work/articles",
    `${id}.json`
  );
  const rawData = fs.readFileSync(filePath, "utf-8");
  const articleData: ContentType = JSON.parse(rawData);

  return {
    props: {
      articleData,
    },
  };
};

export default WorkPage;
