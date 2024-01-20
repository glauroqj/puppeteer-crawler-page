import puppeteer from "puppeteer";
import fs from "fs";

/** crawl and save movies into json file */
function crawlMovies(lang, url) {
  return new Promise((resolve, reject) => {
    (async function () {
      try {
        console.log("< STARTING ... > ", lang, url);

        const browser = await puppeteer.launch({
          product: "chrome",
          slowMo: 800,
          headless: "new",
          devtools: false,
          ignoreDefaultArgs: ["--disable-extensions"],
          args: [
            `--lang=${lang}`,
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

        await page.setExtraHTTPHeaders({ "Accept-Language": lang });
        await page.goto(String(url), {
          waitUntil: "domcontentloaded",
          timeout: 90000,
        });

        const result = await page.evaluate(() => {
          function cleanString(text) {
            if (!text) return text;

            const decodedString = decodeHtmlEntities(text);

            const cleanedString = decodedString
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/ç/g, "c")
              .replace(/[^a-zA-Z0-9\s]/g, "")
              .toLowerCase();

            // Replace spaces with dashes
            const stringWithDashes = cleanedString.replace(/\s+/g, "-");

            return stringWithDashes;
          }

          function decodeHtmlEntities(html) {
            var doc = new DOMParser().parseFromString(html, "text/html");
            return doc.body.textContent;
          }

          function treatAccents(text) {
            if (!text) return "";

            const clean = text
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&amp;/g, "&")
              .replace(/&quot;/g, '"')
              .replace(/&apos;/g, "'");

            return clean;
          }

          const titleSeo = document.title.replace(" - IMDb", "");

          const descriptionRaw = document.querySelector(
            'meta[name="description"]'
          );
          const description = descriptionRaw
            ? descriptionRaw.getAttribute("content")
            : "";

          const matchYear = document.title.match(/\(([^)]+)\)/);
          const year = matchYear ? matchYear[1].replace(/\D/g, "") : "";

          const galleryArray = [];
          const galleryImages = document.querySelectorAll(
            ".ipc-photo__photo-image>img"
          );
          if (galleryImages) {
            galleryImages.forEach((node) => {
              galleryArray.push(node.getAttribute("src"));
            });
          }
          /** BEST PAYLOAD DATA */
          const scriptJsonRaw = document.querySelector(
            'script[type="application/ld+json"]'
          );
          const scriptJson = scriptJsonRaw ? scriptJsonRaw.textContent : "";

          const parsedJson = JSON.parse(scriptJson);

          const {
            url,
            name,
            alternateName,
            image,
            // description,
            aggregateRating,
            genre,
            director,
          } = parsedJson;

          const slug = cleanString(name);
          const lang = document.documentElement.lang.replace(/-BR|-US/g, "");
          const treatDirector = treatAccents(director && director[0]?.name);

          return {
            poster_table: {
              slug,
              title: decodeHtmlEntities(
                lang === "en" ? name : alternateName ? alternateName : name
              ),
              // title: decodeHtmlEntities(alternateName),
              year,
              // genres: genre,
              director: treatDirector,
            },
            poster_lang: {
              lang: lang,
              title: decodeHtmlEntities(
                lang === "en" ? name : alternateName ? alternateName : name
              ),
              // title: decodeHtmlEntities(alternateName),
              description: decodeHtmlEntities(description),
              slug,
              image,
              genres: genre,
              director: treatDirector,
              year,
              infos: {
                genres: genre,
                gallery: galleryArray,
                imdb: {
                  link: url,
                  rating: `${aggregateRating?.ratingValue || "-"}/10`,
                },
                year,
                country: "",
                director: {
                  link: director && director[0]?.url,
                  name: treatDirector,
                },
                seo: {
                  title: decodeHtmlEntities(titleSeo),
                  description: decodeHtmlEntities(description),
                },
              },
            },
          };
        });

        await browser.close();

        if (result) {
          const jsonData = JSON.stringify(result, null, 2);
          const fileName = `${result?.poster_table?.slug}`;
          const langOpts = {
            "pt-BR": "pt",
            "en-US": "en",
          };

          const LANG = langOpts[lang];

          fs.writeFile(
            `./src/_data/json/imdb/${LANG}/${LANG}-${fileName}`,
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
          resolve({
            url,
          });
        } else {
          console.error("< CRAWL MOVIES : ERROR : NO RESULT > ", result);
          resolve({
            url,
            error: true,
          });
        }
      } catch (e) {
        console.error("< CRAWL MOVIES : ERROR : CATCH > ", e);
        reject(e);
      }
    })();
  });
}

export default crawlMovies;
