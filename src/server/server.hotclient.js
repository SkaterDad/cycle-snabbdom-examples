'use strict'
//Environment-related constants
const isDeveloping = process.env.NODE_ENV !== 'production'
const isExperimental = process.env.NODE_ENV === 'exp'
const port = process.env.PORT ? process.env.PORT : 3000
const host = process.env.IP ? process.env.IP : 'localhost'

//Initialize Express server
const express = require('express')
const server = express()

//During Development, set up Webpack Hot Module Replacement
if (isDeveloping) {
  console.log('Setting up Webpack hot loading! Wait for successful bundle creation before opening the app.')
  // Step 1: Create & configure a webpack compiler
  const webpack = require('webpack')
  const webpackConfig = isExperimental ? require('../../webpack.config.restart.js') : require('../../webpack.config.js')
  const compiler = webpack(webpackConfig)
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')

  server.use(webpackDevMiddleware(compiler, {
    hot: true,
    filename: 'bundle.js',
    publicPath: webpackConfig.output.publicPath,
    stats: {colors: true},
    inline: true,
    historyApiFallback: true,
  }))

  server.use(webpackHotMiddleware(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
  }))
}

//Define static asset directories which Express will serve
//TODO: Use nginx in production.
server.use(`/dist`, express.static(`dist`))
server.use(`/img`, express.static(`img`))

//Redirection test
//This simulates a server which replies with a 302/303 redirection after a form POST.
//The client code can't actually see this redirect url :(, so creative alternatives
//must be brewed up.
server.post('/redirect', (req, res) => {
  res.redirect(302, '/hero-simple')
})

// Ignore favicon requests
server.get('/favicon.ico',(req, res) => {
  res.writeHead(200, {'Content-Type': 'image/x-icon'})
  res.end()
  return
})

//Serve data to the Hero-Complex Example
let theData = require('./data.json')
if (theData.length) {
  console.log('Data loaded, length = ' + theData.length)
} else {
  console.log('Data not loaded')
}

server.get('/data', (req, res) => {
  //Log each request
  console.log(`Github data requested @ ${new Date().toString()}`)
  res.json(theData)
})

//Fake api to troubleshoot github search page
server.get('/mocksearch', (req, res) => {
  const searchTerm = req.query.q || ''
  //Log each request
  console.log(`Github search for ${searchTerm} requested @ ${new Date().toString()}`)
  let modifiedData = JSON.parse(JSON.stringify(theData)) //clone
  modifiedData[0].full_name = `You searched for "${searchTerm}"!`
  res.json(modifiedData)
})

//For now, any get requests will send the Index.html
server.get('/*', (req, res) => {
  if (isDeveloping) {
    res.sendFile(__dirname + '/index.dev.html')
  } else {
    res.sendFile(__dirname + '/index.html')
  }
})

//Start listening to HTTP requests
server.listen(port, host, () => {
  console.log('Server listening at http://%s:%s', host, port)
  console.log('Node environment = ' + process.env.NODE_ENV)
})
