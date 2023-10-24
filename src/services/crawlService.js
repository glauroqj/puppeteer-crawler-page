import puppeteer from "puppeteer";
import fs from "fs";
// const iPhone6 = puppeteer.devices['iPhone 6']

const crawlService = ({ url, environment, folderName, idx }) =>
  new Promise(async (resolve, reject) => {
    if (!url || !environment || !folderName) throw "Some params are missing!";

    try {
      /** check folder */
      if (!fs.existsSync(`./src/_data/screenshots/${folderName}`)) {
        fs.mkdirSync(`./src/_data/screenshots/${folderName}`);
      }

      const browser = await puppeteer.launch({
        product: "chrome",
        slowMo: 350,
        ignoreDefaultArgs: ["--disable-extensions"],
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--disable-setuid-sandbox",
        ],
      });
      const page = await browser.newPage();

      page.setUserAgent(
        "APIs-Google (+https://developers.google.com/webmasters/APIs-Google.html)"
      );
      page.setViewport({
        width: 1280,
        height: 3000,
        isMobile: false,
        isLandscape: true,
      });

      await page.goto(String(url), { waitUntil: "domcontentloaded" });
      // await page.emulate( iPhone6 )
      await page.screenshot({
        path: `./src/_data/screenshots/${folderName}/${environment + idx}.png`,
        fullPage: true,
      });

      // Extract data from the website
      // const data = await page.evaluate(() => {
      //   // Customize this part to scrape the specific data you need from the website
      //   const title = document.title;
      //   const paragraphText = document.querySelector("p").textContent;

      //   return {
      //     title,
      //     paragraphText,
      //   };
      // });

      // const jsonData = JSON.stringify(data, null, 2);

      // fs.writeFile(
      //   `./src/_data/json/${folderName}`,
      //   jsonData,
      //   "utf8",
      //   (err) => {
      //     if (err) {
      //       console.error("Error writing JSON file:", err);
      //     } else {
      //       console.log(`JSON data saved to ${filePath}`);
      //     }
      //   }
      // );

      await browser.close();

      resolve(url);
    } catch (e) {
      reject(e);
    }
  });

export default crawlService;
