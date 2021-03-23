import express from 'express'
import bodyParser from 'body-parser'
/** services */
import crawlService from './services/crawlService'

const port = 5000
const app = express()

app.get('/', (req, res) => {
  res.json({status: 'Server is running!'})
})

app.post('/crawl', bodyParser.json(), (req, res) => {
  const { routes, environment, folderName } = req?.body || false

  if (routes?.length > 0) {

    try {
      routes.map(async (url, idx) => await crawlService({url, environment, folderName, idx}))
      console.log('\x1b[33m < SUCCESS > ', folderName, environment, routes?.length, routes, '\x1b[0m')
      res.status(200).send('done!')
    } catch(e) {
      res.status(500).send(e)
    }
  } else {
    res.status(400).send('something get wrong!')
  }

})

app.listen(port, () => {
  console.log(`Server is running at localhost:${port}`)
})