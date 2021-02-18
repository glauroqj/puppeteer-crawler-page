import puppeteer from 'puppeteer'
import fs from 'fs'
import { response } from 'express'
// const iPhone6 = puppeteer.devices['iPhone 6']

const crawlService = ({url, environment, folderName, idx}) =>
  new Promise(async (resolve, reject) => {

    try {
      /** check folder */
      if (!fs.existsSync(`./src/screenshots/${folderName}`)){
        fs.mkdirSync(`./src/screenshots/${folderName}`)
      }

      const browser = await puppeteer.launch({
        product: 'chrome',
        slowMo: 350,

      })
      const page = await browser.newPage()
      page.setUserAgent('APIs-Google (+https://developers.google.com/webmasters/APIs-Google.html)')
      await page.goto( String(url), { waitUntil: 'domcontentloaded' } )
      // await page.waitForNavigation({waitUntil: 'networkidle0'})
      // await page.emulate( iPhone6 )
      await page.screenshot({path: `./src/screenshots/${folderName}/${environment+idx}.png`, fullPage: true});
      await browser.close()

      resolve()
    }
    catch(e) {
      reject(e)
    }
})

export default crawlService