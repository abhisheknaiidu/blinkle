import { Blink, BLINK_TYPE } from "@/types";
import * as fs from "fs";
import * as path from "path";
import * as puppeteer from "puppeteer";

export async function generateImage(
  blink: Blink,
  userId: string
): Promise<string> {
  const templateDir = path.join(process.cwd(), "src/services/helpers");
  let htmlContent: string;

  // Choose the correct template based on blink type
  switch (blink.type) {
    case BLINK_TYPE.GITHUB:
      htmlContent = fs.readFileSync(
        path.join(templateDir, "github-image/index.html"),
        "utf8"
      );
      break;
    case BLINK_TYPE.DRIP:
      htmlContent = fs.readFileSync(
        path.join(templateDir, "drip-image/index.html"),
        "utf8"
      );
      break;
    case BLINK_TYPE.FUNDRAISER:
      htmlContent = fs.readFileSync(
        path.join(templateDir, "fundraiser/index.html"),
        "utf8"
      );
      break;
    default:
      throw new Error("Invalid blink type");
  }

  // Replace placeholders in the HTML content
  htmlContent = htmlContent.replace(/\{\{title\}\}/g, blink.title);
  htmlContent = htmlContent.replace(/\{\{description\}\}/g, blink.description);
  htmlContent = htmlContent.replace(/\{\{raised\}\}/g, blink.raised.toFixed(2));
  if (blink.type !== BLINK_TYPE.FUNDRAISER && blink.avatar) {
    htmlContent = htmlContent.replace(/\{\{avatar\}\}/g, blink.avatar);
  }

  // Launch puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 800 });

  // Set content and wait for any resources to load
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  // Inject CSS files
  const cssFiles = ["styles.css", "variables.scss"];
  for (const cssFile of cssFiles) {
    const cssPath = path.join(templateDir, blink.type.toLowerCase(), cssFile);
    if (fs.existsSync(cssPath)) {
      const cssContent = fs.readFileSync(cssPath, "utf8");
      await page.evaluate((css) => {
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
      }, cssContent);
    }
  }

  // Create directory for user if it doesn't exist
  const publicDirectory = path.join(process.cwd(), "public/images", userId);
  if (!fs.existsSync(publicDirectory)) {
    fs.mkdirSync(publicDirectory, { recursive: true });
  }

  // Save the screenshot
  const imagePath = path.join(publicDirectory, `${blink.id}.png`);
  await page.screenshot({ path: imagePath });
  await browser.close();

  return `${userId}/${blink.id}`;
}
