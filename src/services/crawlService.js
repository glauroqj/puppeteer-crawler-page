import puppeteer from 'puppeteer'
import fs from 'fs'
// const iPhone6 = puppeteer.devices['iPhone 6']

const crawlService = ({url, environment, folderName, idx}) =>
  new Promise(async (resolve, reject) => {

    try {
      /** check folder */
      if (!fs.existsSync(`./src/screenshots/${folderName}`)){
        fs.mkdirSync(`./src/screenshots/${folderName}`)
      }

      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      // await page.emulate( iPhone6 )
      await page.goto( String(url) )
      await page.screenshot({path: `./src/screenshots/${folderName}/${environment+idx}.png`, fullPage: true});
      await browser.close()

      resolve()
    }
    catch(e) {
      reject(e)
    }
})

export default crawlService