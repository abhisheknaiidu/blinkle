import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

type Data = {
  title?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // await page.setViewport({ width: 1080, height: 1024 });
    // await page.goto("https://www.amazon.com");
    await page.goto("https://drip.haus/morningthoughts", {
      waitUntil: "domcontentloaded",
    });

    // await page.type(".devsite-search-field", "automate beyond recorder");
    // await page.click(".devsite-result-item-link");

    const textSelector = await page.waitForSelector(".waitForSelector");
    // const fullTitle = await textSelector?.evaluate((el) => el.textContent);
    console.log("pageeeee<<<<<", textSelector);

    await browser.close();

    res.status(200).json({ title: textSelector });
  } catch (error) {
    res.status(500).json({ error: "Failed to scrape the website" });
  }
}
