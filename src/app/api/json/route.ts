import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ContentType } from "@/types/types";

// ✅ API 라우트에서 JSON 파일 불러오기
export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public/jsons/work/articles/mock");
    const files = fs.readdirSync(dir);
    const data: ContentType[] = files
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const filePath = path.join(dir, file);
        const rawData = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(rawData) as ContentType;
      });

    return NextResponse.json(data); // ✅ NextResponse로 JSON 응답 반환
  } catch (error) {
    return NextResponse.json(
      { error: "데이터를 불러오는 중 오류 발생" },
      { status: 500 }
    );
  }
}
