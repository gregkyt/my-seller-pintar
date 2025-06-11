import { Cookies } from "@/constants/cookie";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new NextResponse("Missing image url", { status: 400 });
  }

  try {
    const token = req.cookies.get(Cookies.token);
    const response = await fetch(url ?? "", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return new NextResponse("Failed to fetch from S3", { status: 500 });
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
