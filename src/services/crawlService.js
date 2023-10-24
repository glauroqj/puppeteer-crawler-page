import puppeteer from "puppeteer";
import fs from "fs";

const crawlService = ({ url, environment, folderName, idx }) =>
  new Promise(async (resolve, reject) => {
    if (!url || !environment || !folderName) throw "Some params are missing!";

    (async function () {
      try {
        /** check folder */
        // if (!fs.existsSync(`./src/_data/screenshots/${folderName}`)) {
        //   fs.mkdirSync(`./src/_data/screenshots/${folderName}`);
        // }

        const browser = await puppeteer.launch({
          product: "chrome",
          slowMo: 1000,
          headless: true,
          devtools: false,
          ignoreDefaultArgs: ["--disable-extensions"],
          args: [
            "--lang=en-US",
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

        const result = await page.evaluate(() => {
          const titleRaw = document.querySelector(
            "[data-testid='hero__pageTitle']"
          );
          const title = titleRaw ? titleRaw.textContent : "";

          const descriptionRaw = document.querySelector(
            'meta[name="description"]'
          );
          const description = descriptionRaw
            ? descriptionRaw.getAttribute("content")
            : "";

          const ratingRaw = document.querySelector(
            '[data-testid="hero-rating-bar__aggregate-rating__score"]'
          );
          const rating = ratingRaw ? ratingRaw.textContent : "";

          function cleanString(text) {
            if (!text) return text;

            const removeAccent = text
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");

            return removeAccent.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
          }

          const slug = cleanString(title);

          const yearRaw = titleRaw?.nextElementSibling;

          const year = yearRaw ? yearRaw.querySelector("li").textContent : "";
          // {
          //   id: '',
          //   slug: '',
          //   title: '',
          //   description: '',
          //   infos: {
          //   "imdb": {
          //     "link": "https://www.imdb.com/title/tt0073195/",
          //     "rating": "8.1/10"
          //    },
          //   "year": 1945,
          //   "country": "U.S.A",
          //   "director": {
          //     "link": "https://www.imdb.com/name/nm0000229/?ref_=tt_ov_dr",
          //     "name": "Steven Spielberg"
          //     }
          //   }
          // }

          return {
            title,
            description,
            slug,
            infos: {
              imdb: {
                link: "",
                rating,
              },
              year,
              country: "",
              director: {
                link: "",
                name: "",
              },
            },
          };
        });

        // await page.screenshot({
        //   path: `./src/_data/screenshots/${folderName}/${environment + idx}.png`,
        //   fullPage: true,
        // });

        if (result && result?.infos?.imdb) {
          result.infos.imdb.link = url;
          const jsonData = JSON.stringify(result, null, 2);
          const fileName = `${result?.title}`;

          fs.writeFile(
            `./src/_data/json/${fileName}`,
            jsonData,
            "utf8",
            (err) => {
              if (err) {
                console.error("Error writing JSON file:", err);
              } else {
                console.log(`JSON data saved to ${fileName}`);
              }
            }
          );
        }

        console.log("< FINAL DATA > ", result);

        await browser.close();

        resolve(url);
      } catch (e) {
        reject(e);
      }
    })();
  });

export default crawlService;
