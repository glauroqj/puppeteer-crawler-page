# puppeteer-crawler-page

## Crawl example

https://www.imdb.com/search/title/?title_type=feature&genres=adventure

```
  const arrayValues = []
  const elements = document.querySelectorAll('.ipc-title-link-no-icon > a.ipc-title-link-wrapper')
  elements.forEach((item) => {
    const anchorElements = item.querySelectorAll('a');
    console.log(item.href)
    arrayValues.push(`${item.href}`)
  })
```
