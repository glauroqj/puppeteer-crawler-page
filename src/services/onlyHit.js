// import puppeteer from 'puppeteer'
import fetch from 'node-fetch'

const onlyHit = ({url, numberToRepeat}) => new Promise(async resolve => {
  try {
    if (!url || !numberToRepeat) resolve(false)
    let queueArray = []
    const buildURL = `https://${url}`
    const repeat = Number(numberToRepeat)
    // const build = async () => {
    //   const browser = await puppeteer.launch({
    //     product: 'chrome',
    //     slowMo: 350,
    //     ignoreDefaultArgs: ['--disable-extensions'],
    //     headless: true,
    //     args: ['--no-sandbox', '--disable-setuid-sandbox']
    //   })
    //   const page = await browser.newPage()
    //   page.setUserAgent('APIs-Google (+https://developers.google.com/webmasters/APIs-Google.html)')
    //   page.setViewport({
    //     width: 1280,
    //     height: 3000,
    //     isMobile: false,
    //     isLandscape: true
    //   })
    
      // for (let i=0; i <= repeat; i++) {
      //   console.log('< HIT :] >')
      //   await page.goto( String(buildURL) )
      // }
    //   await browser.close()
    // }

    for (let i=0; i <= repeat; i++) {
      console.log('< HIT :] > ', i)
      // page.goto( String(buildURL) )
      queueArray = [...queueArray, fetch(buildURL, {method: 'get'})]
    }

    setTimeout(() => {
      resolve(queueArray)
    }, 20000)
  } catch (e) {
    console.warn('< onlyHit : error > ', e)
    resolve(false)
  }
})

export default onlyHit