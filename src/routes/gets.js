

export default ({app, parser, cors, corsOptions}) => {

  app.get('/', (req, res) => {
    res.json({status: 'Server is running!'})
  })


}