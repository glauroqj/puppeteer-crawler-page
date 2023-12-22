/** lib */
import crawlMovies from "lib/puppeteer/crawlMovies";

const crawlService = ({ url, environment, folderName, idx, lang = "en" }) =>
  new Promise(async (resolve, reject) => {
    if (!url || !environment || !folderName) throw "Some params are missing!";
    Promise.allSettled([crawlMovies("en-US", url), crawlMovies("pt-BR", url)])
      .then((values) => {
        console.log("< VALUES > ", values);

        resolve(values);
      })
      .catch((e) => {
        reject(e);
      });

    // (async function () {
    //   try {
    //     console.log("< STARTING ... > ", lang, url);
    //     /** check folder */
    //     // if (!fs.existsSync(`./src/_data/screenshots/${folderName}`)) {
    //     //   fs.mkdirSync(`./src/_data/screenshots/${folderName}`);
    //     // }

    //     const browser = await puppeteer.launch({
    //       product: "chrome",
    //       slowMo: 800,
    //       headless: "new",
    //       devtools: false,
    //       ignoreDefaultArgs: ["--disable-extensions"],
    //       args: [
    //         `--lang=${LANG}`,
    //         "--no-sandbox",
    //         "--disable-setuid-sandbox",
    //         "--disable-gpu",
    //         "--disable-dev-shm-usage",
    //         "--disable-setuid-sandbox",
    //       ],
    //     });
    //     const page = await browser.newPage();

    //     page.setUserAgent(
    //       "APIs-Google (+https://developers.google.com/webmasters/APIs-Google.html)"
    //     );
    //     page.setViewport({
    //       width: 1280,
    //       height: 3000,
    //       isMobile: false,
    //       isLandscape: true,
    //     });

    //     await page.setExtraHTTPHeaders({ "Accept-Language": LANG });

    //     await page.goto(String(url), {
    //       waitUntil: "domcontentloaded",
    //       timeout: 90000,
    //     });

    //     const result = await page.evaluate(() => {
    //       function cleanString(text) {
    //         if (!text) return text;

    //         const decodedString = decodeHtmlEntities(text);

    //         const cleanedString = decodedString
    //           .normalize("NFD")
    //           .replace(/[\u0300-\u036f]/g, "")
    //           .replace(/ç/g, "c")
    //           .replace(/[^a-zA-Z0-9\s]/g, "")
    //           .toLowerCase();

    //         // Replace spaces with dashes
    //         const stringWithDashes = cleanedString.replace(/\s+/g, "-");

    //         return stringWithDashes;
    //       }

    //       function decodeHtmlEntities(html) {
    //         var doc = new DOMParser().parseFromString(html, "text/html");
    //         return doc.body.textContent;
    //       }

    //       // const titleRaw = document.querySelector(
    //       //   "[data-testid='hero__pageTitle']"
    //       // );
    //       const titleSeo = document.title.replace(" - IMDb", "");

    //       const descriptionRaw = document.querySelector(
    //         'meta[name="description"]'
    //       );
    //       const description = descriptionRaw
    //         ? descriptionRaw.getAttribute("content")
    //         : "";

    //       // const ratingRaw = document.querySelector(
    //       //   '[data-testid="hero-rating-bar__aggregate-rating__score"]'
    //       // );
    //       // const rating = ratingRaw ? ratingRaw.textContent : "";

    //       const matchYear = document.title.match(/\(([^)]+)\)/);
    //       const year = matchYear ? matchYear[1] : "";

    //       // const year = document.querySelector(
    //       //   "ul.baseAlt > li:first-child a"
    //       // ).innerHTML;

    //       // const imageRaw = document.querySelector('meta[property="og:image"]');
    //       // const image = imageRaw ? imageRaw.getAttribute("content") : "";

    //       // const genresArray = [];
    //       // const genresRaw = document.querySelectorAll(
    //       //   ".ipc-chip-list__scroller > a"
    //       // );
    //       // if (genresRaw) {
    //       //   genresRaw.forEach((node) => {
    //       //     genresArray.push(node.textContent);
    //       //   });
    //       // }

    //       // const directorRaw = document.querySelector(
    //       //   '[data-testid="title-pc-principal-credit"] div ul li a'
    //       // );
    //       // const directorName = directorRaw ? directorRaw.textContent : "";
    //       // const directorLink = directorRaw
    //       //   ? directorRaw.getAttribute("href")
    //       //   : "";

    //       const galleryArray = [];
    //       const galleryImages = document.querySelectorAll(
    //         ".ipc-photo__photo-image>img"
    //       );
    //       if (galleryImages) {
    //         galleryImages.forEach((node) => {
    //           galleryArray.push(node.getAttribute("src"));
    //         });
    //       }
    //       /** BEST PAYLOAD DATA */
    //       const scriptJsonRaw = document.querySelector(
    //         'script[type="application/ld+json"]'
    //       );
    //       const scriptJson = scriptJsonRaw ? scriptJsonRaw.textContent : "";

    //       const parsedJson = JSON.parse(scriptJson);

    //       const {
    //         url,
    //         name,
    //         alternateName,
    //         image,
    //         // description,
    //         aggregateRating,
    //         genre,
    //         director,
    //       } = parsedJson;

    //       const slug = cleanString(name);
    //       const lang = document.documentElement.lang.replace(/-BR|-US/g, "");

    //       return {
    //         poster_table: {
    //           slug,
    //           title: decodeHtmlEntities(
    //             lang === "en" ? name : alternateName ? alternateName : name
    //           ),
    //           // title: decodeHtmlEntities(alternateName),
    //           year,
    //           // genres: genre,
    //           director: director && director[0]?.name,
    //         },
    //         poster_lang: {
    //           lang: lang,
    //           title: decodeHtmlEntities(
    //             lang === "en" ? name : alternateName ? alternateName : name
    //           ),
    //           // title: decodeHtmlEntities(alternateName),
    //           description: decodeHtmlEntities(description),
    //           slug,
    //           image,
    //           genres: genre,
    //           director: director && director[0]?.name,
    //           year,
    //           infos: {
    //             genres: genre,
    //             gallery: galleryArray,
    //             imdb: {
    //               link: url,
    //               rating: `${aggregateRating?.ratingValue || "-"}/10`,
    //             },
    //             year,
    //             country: "",
    //             director: {
    //               link: director && director[0]?.url,
    //               name: director && director[0]?.name,
    //             },
    //             seo: {
    //               title: decodeHtmlEntities(titleSeo),
    //               description: decodeHtmlEntities(description),
    //             },
    //           },
    //         },
    //       };
    //     });

    //     if (result) {
    //       const jsonData = JSON.stringify(result, null, 2);
    //       const fileName = `${result?.poster_table?.slug}`;

    //       fs.writeFile(
    //         `./src/_data/json/imdb/${lang}/${lang}-${fileName}`,
    //         jsonData,
    //         "utf8",
    //         (err) => {
    //           if (err) {
    //             console.error("Error writing JSON file:", err);
    //           } else {
    //             console.log(`JSON data saved to ${fileName}`);
    //           }
    //         }
    //       );
    //     }

    //     console.log("< FINAL DATA > ", result);

    //     await browser.close();

    //     resolve(url);
    //   } catch (e) {
    //     reject(e);
    //   }
    // })();
  });

export default crawlService;
