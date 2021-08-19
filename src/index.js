import express from 'express'
/** routes */
import routes from 'routes/routes'

const port = 5000
const app = express()

/** app routes */
routes(app)

app.listen(port, () => {
  console.log(`Server is running at localhost:${port}`)
})