import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

export async function POST(request: Request) {
  const { searchPrompt: userSearch } = await request.json();

  if (!userSearch) {
    return NextResponse.json(
      { error: "Search parameter not provided" },
      { status: 400 }
    );
  }
  let browser;

  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://drip.haus/${userSearch}`, {
      waitUntil: "domcontentloaded",
    });

    const textSelector = await page.waitForSelector(".res-h2");
    const imgSrc = await page.evaluate(() => {
      const imgElements = document.querySelectorAll(
        "img.object-cover.w-full.h-full"
      );
      // Filter images that do not have 'object-center' in their class list
      for (let img of imgElements) {
        if (!img.classList.contains("object-center")) {
          return img.getAttribute("src");
        }
      }
      return null;
    });
    const fullTitle = await textSelector?.evaluate((el) => el.textContent);
    const About = await page.evaluate(() => {
      const text = document.querySelector("#headlessui-disclosure-panel");
      return text?.textContent;
    });
    const html = await page.content(); //get the entire html content
    const $ = cheerio.load(html); //load the html content

    // const title = $(".res-h2").text();
    const perksContent = $(
      "p.break-words.font-inter.text-left.text-sm.whitespace-pre-line"
    ).text();
    const AboutContent = $(
      "#headlessui-disclosure-panel-\\:r1e\\: > div"
    ).text();

    console.log("html<<<<<", About, AboutContent);

    const details = {
      title: fullTitle,
      avatar_url: imgSrc,
      perksContent,
    };

    return NextResponse.json({ details });
  } catch (error: any) {
    return NextResponse.json(
      { error: `An error occurred: ${error.message}` },
      { status: 200 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
