import { NextResponse } from "next/server";
import { readArticles } from "@/lib/work";

// ✅ API 라우트에서 JSON 파일 불러오기
export async function GET() {
  try {
    return NextResponse.json(readArticles()); // ✅ NextResponse로 JSON 응답 반환
  } catch {
    return NextResponse.json(
      { error: "데이터를 불러오는 중 오류 발생" },
      { status: 500 }
    );
  }
}
