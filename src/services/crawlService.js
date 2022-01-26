import puppeteer from "puppeteer";
import fs from "fs";
// const iPhone6 = puppeteer.devices['iPhone 6']

const crawlService = ({ url, environment, folderName, idx }) =>
  new Promise(async (resolve, reject) => {
    if (!url || !environment || !folderName) throw "Some params are missing!";

    try {
      /** check folder */
      if (!fs.existsSync(`./src/screenshots/${folderName}`)) {
        fs.mkdirSync(`./src/screenshots/${folderName}`);
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
        path: `./src/screenshots/${folderName}/${environment + idx}.png`,
        fullPage: true,
      });
      await browser.close();

      resolve(url);
    } catch (e) {
      reject(e);
    }
  });

export default crawlService;
