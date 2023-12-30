# puppeteer-crawler-page

## Crawl example

```
  const arrayValues = []
  const elements = document.querySelectorAll('.ipc-title-link-no-icon > a.ipc-title-link-wrapper')
  elements.forEach((item) => {
    const anchorElements = item.querySelectorAll('a');
    console.log(item.href)
    arrayValues.push(`"${item.href}"`)
  })
```
