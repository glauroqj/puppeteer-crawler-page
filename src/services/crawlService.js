import puppeteer from "puppeteer";
import fs from "fs";

const crawlService = ({ url, environment, folderName, idx }) =>
  new Promise(async (resolve, reject) => {
    if (!url || !environment || !folderName) throw "Some params are missing!";

    try {
      /** check folder */
      // if (!fs.existsSync(`./src/_data/screenshots/${folderName}`)) {
      //   fs.mkdirSync(`./src/_data/screenshots/${folderName}`);
      // }

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
      // await page.screenshot({
      //   path: `./src/_data/screenshots/${folderName}/${environment + idx}.png`,
      //   fullPage: true,
      // });

      // Extract data from the website
      const data = await page.evaluate(async () => {
        const title =
          document.querySelector("[data-testid='hero__pageTitle']")
            .textContent || "";

        const descriptionRaw = document.querySelector(
          'meta[name="description"]'
        );
        const description = descriptionRaw
          ? descriptionRaw.getAttribute("content")
          : "";

        const rating =
          document.querySelector(
            '[data-testid="hero-rating-bar__aggregate-rating__score"]'
          ).textContent || "";

        const slug = title.toLowerCase().replaceAll(" ", "") || "";

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
            year: "",
            country: "",
            director: {
              link: "",
              name: "",
            },
          },
        };
      });

      console.log("< FINAL DATA > ", data);
      const jsonData = JSON.stringify(data, null, 2);
      const fileName = `${data?.title}`;

      // console.log("< FS EXIST ?? > ", fs);

      // fs.writeFile(`./src/_data/json/${fileName}`, jsonData, "utf8", (err) => {
      //   if (err) {
      //     console.error("Error writing JSON file:", err);
      //   } else {
      //     console.log(`JSON data saved to ${fileName}`);
      //   }
      // });

      await browser.close();

      resolve(url);
    } catch (e) {
      reject(e);
    }
  });

export default crawlService;
