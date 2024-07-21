import * as puppeteer from "puppeteer";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";

// fetch html from ./helpers/image.html

export async function generateImage(
  raised: number,
  goal: number
): Promise<string> {
  let htmlContent = fs.readFileSync(
    path.join(process.cwd(), "src/services/helpers/image.html"),
    "utf8"
  );

  htmlContent = htmlContent.replaceAll("{{raised}}", raised.toFixed(2));
  htmlContent = htmlContent.replaceAll("{{goal}}", goal.toFixed(2));
  htmlContent = htmlContent.replaceAll(
    "{{percentValue}}",
    ((raised / goal) * 100).toFixed(2)
  );
  console.log(htmlContent);
  //   const htmlContent = `
  //     <!DOCTYPE html>
  //     <html lang="en">
  //     <head>
  //         <meta charset="UTF-8">
  //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //         <title>Progress Image</title>
  //         <!-- Include any external CSS or fonts here -->
  //         <style>
  //             body { font-family: Arial, sans-serif; }
  //             .container {
  //                 display: flex;
  //                 width: 800px;
  //                 height: 600px;
  //                 align-items: center;
  //                 justify-content: center;
  //             }
  //             .left {
  //                 width: 50%;
  //                 /* Add styles for the progress ring here */
  //             }
  //             .right {
  //                 width: 50%;
  //                 text-align: center;
  //             }
  //         </style>
  //     </head>
  //     <body>
  //         <div class="container">
  //             <div class="left">
  //                 <!-- Create the ring progress here -->
  //             </div>
  //             <div class="right">
  //                 <h1>${raised} / ${goal} SOL</h1>
  //                 <p>Raised</p>
  //             </div>
  //         </div>
  //     </body>
  //     </html>
  //   `;

  // Launch puppeteer
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 800 });
  await page.setContent(htmlContent, {
    waitUntil: "networkidle0",
  });

  const imageId = uuidv4();
  const publicDir = path.join(__dirname, "public");
  const currentDirectory = process.cwd();
  const publicDirectory = path.join(currentDirectory, "public/images");
  console.log(publicDirectory);
  const imagePath = path.join(publicDirectory, `${imageId}.png`);

  // Check if the 'public' directory exists, if not, create it
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Take a screenshot
  await page.screenshot({ path: imagePath });
  await browser.close();

  return imageId;
}

// (async () => {
//   try {
//     const raised = 1500;  // Example raised amount
//     const goal = 5000;    // Example goal amount
//     const imageId = await generateImage(raised, goal);
//     console.log(`Image saved with ID: ${imageId}`);
//   } catch (e) {
//     console.error('Error generating image:', e);
//   }
// })();
