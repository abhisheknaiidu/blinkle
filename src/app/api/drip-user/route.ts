// app/api/fetchContent/route.js
import { NextRequest, NextResponse } from "next/server";
import cheerio from "cheerio";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  console.log("username", username);

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`https://drip.haus/${username}`);
    const html = await response.text();
    console.log("html", html);

    // Use Cheerio to parse the HTML if needed
    const $ = cheerio.load(html);
    const content = $("#content").html(); // Adjust the selector based on the actual content structure

    return NextResponse.json({ content: content || html });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}
