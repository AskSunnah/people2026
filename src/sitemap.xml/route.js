import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.API_BASE.replace(/\/$/, "") + "/sitemap.xml";

  const response = await fetch(backendUrl, {
    cache: "no-store",
  });

  if (!response.ok) {
    return new NextResponse("Unable to load sitemap", {
      status: 500,
    });
  }

  const xml = await response.text();

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
