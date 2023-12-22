import puppeteer from "puppeteer";

function magicStuff() {
  return new Promise((resolve, reject) => {
    (async function () {
      try {
        console.log("< STARTING ... > ");
        /** check folder */
        // if (!fs.existsSync(`./src/_data/screenshots/${folderName}`)) {
        //   fs.mkdirSync(`./src/_data/screenshots/${folderName}`);
        // }

        const browser = await puppeteer.launch({
          product: "chrome",
          // slowMo: 800,
          headless: "new",
          devtools: false,
          ignoreDefaultArgs: ["--disable-extensions"],
          args: [
            `--lang=pt-BR`,
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--disable-web-security",
            "--disable-features=IsolateOrigins,site-per-process",
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

        await page.setExtraHTTPHeaders({ "Accept-Language": "pt-BR" });

        await page.goto("https://www.sdm.prodemge.gov.br/CAisd/pdmweb.exe", {
          waitUntil: "domcontentloaded",
          timeout: 90000,
        });

        await page.type("#USERNAME", "p611445");
        await page.type("#PIN", "Lurob2023");

        await page.evaluate(() => {
          document.getElementById("imgBtn0").click();
        });

        await page.waitForTimeout(10000);

        // page.waitForNavigation();

        // https://www.sdm.prodemge.gov.br/CAisd/pdmweb.exe?SID=1917136981+FID=7082+OP=SEARCH+FACTORY=cr+KEEP.where_clause=type%20%3D%20%27I%27%20AND%20active%20%3D%201%20AND%20status.code%20%3D%20%27ZAGATD%27%20AND%20group.%5Bgroup%5Dgroup_list.member%20IN%20%28U%27538693813B499948AB68BCF1BA92B582%27%29

        // await page.waitForNavigation();
        // await page.waitForTimeout(10000);

        // Wait until the frame with name "product" is ready
        // const frame = await frameHandle.contentFrame();

        // const mainFrame = await page.waitForSelector('frame[name="product"]');
        // const mainFrameSet = await page.evaluate(() => {
        //   const frameHandle = document.querySelector('frame[name="product"]');
        //   // This function is executed in the context of the browser
        //   // You can use standard DOM methods to query the element
        //   return frameHandle;
        // });

        // await targetFrame.waitForSelector('#yourElementId', { visible: true });

        const elementText = await page.$eval("document", (element) => {
          return element.textContent;
        });

        console.log("Element Text:", elementText);

        const pageTitle = await page.title();

        console.log(pageTitle, frameHandle);

        // const text = await frame.$eval(
        //   "#s1pm",
        //   (element) => element.textContent
        // );
        // console.log(mainFrame);

        // scoreboard
        // cai_main

        // const pageTitle = await page.title();

        // const btn1 = await page.waitForSelector("button#s1pm");
        // btn1.click();

        // const btn2 = await page.waitForSelector("button#s2ds");
        // btn2.click();

        // const btn3 = await page.waitForSelector("#imgBtn4");
        // btn3.click();

        // const btn = await page.locator("button#s1pm");

        // await page.click("#s1pm");
        // await page.waitForNavigation();
        // await page.click("#s2ds");
        // await page.waitForNavigation();

        // const frame = await page
        //   .frames()
        //   .find((frame) => frame.name() === "product");

        // console.log("< FRAME > ", frame);
        // const element = await page.evaluate(() => {
        //   // frame.click('#your-element-id');

        //   // const frameElement = document.getElementsByName("product")[0];

        //   // if (frameElement) {
        //   //   const doc = frameElement.contentDocument;
        //   //   const listBtn = doc.getElementById("s1pm");

        //   //   console.log("< FRAME ELEMENT >", doc.getElementById("s1pm"));

        //   //   return doc.getElementById("s1pm");
        //   // }

        //   return frame;
        // });

        // await page.waitForTimeout(3000);

        // await page.click("#imgBtn4");
        // await page.waitForNavigation();

        // console.log("Page Title:", pageTitle, btn);

        // await page.waitForTimeout(3000);

        // const result = await page.evaluate(() => {
        //   const inputElementName = document.getElementById("USERNAME");
        //   const inputElementPass = document.getElementById("PIN");

        //   const btnAction = document.getElementsByClassName("loginbtn")[0];

        //   if (!!inputElementName) {
        //     inputElementName.value = "p611445";
        //   }

        //   if (!!inputElementPass) {
        //     inputElementPass.value = "Lurob2023";
        //   }

        //   if (btnAction) {
        //     btnAction.click();
        //   }

        //   const titleSeo = document.title.replace("", "");

        //   // console.log("< INPUTS > ", titleSeo);

        //   return {
        //     titleSeo,
        //     // inputElementName: inputElementName.value,
        //     // inputElementPass: inputElementPass.value,
        //   };
        // });

        // await page.screenshot({
        //   path: `./src/_data/screenshots/${folderName}/${environment + idx}.png`,
        //   fullPage: true,
        // });

        // if (result) {
        //   console.log("< RESULT > ", result);
        // }

        await browser.close();

        resolve(true);
      } catch (e) {
        reject(e);
      }
    })();
  });
}

export default magicStuff;
