import onlyHit from 'services/onlyHit'

export default ({app, parser, cors, corsOptions}) => {

  app.get('/', parser, cors(corsOptions), (req, res) => {
    res.json({status: 'Server is running!'})
  })


  app.get('/hit/:url?/:numberToRepeat?', parser, cors(corsOptions), async (req, res) => {
    const { url, numberToRepeat } = req?.query
    console.log('< HIT > ', req?.query )

    if (!url || !numberToRepeat) {
      res.status(404).send('something get wrong!')
      return false
    }

    const queueService = await onlyHit({ url, numberToRepeat })

    // console.log('< QUEUE SERVICE > ', queueService)

    Promise.allSettled([...queueService])
    .then(values => {
      
      console.log('< VALUES > ', values)

      res.status(200).send({
        data: values,
        message: 'Consider Done!'
      })

    })
    .catch(e => {
      res.status(500).send(e?.message || 'something get wrong!')
    })
  })
}