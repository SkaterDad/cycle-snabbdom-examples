'use strict'
const isDeveloping = process.env.NODE_ENV !== 'production'
const port = 3000//isDeveloping ? 3000 : process.env.PORT

const express = require('express')
const server = express()

// ************************************
// This is the real meat of the example
// ************************************
if (isDeveloping) {
  console.log('Node env=dev, so we\'ll set up Webpack hot loading! Be patient.')
  // Step 1: Create & configure a webpack compiler
  const webpack = require('webpack')
  const webpackConfig = require('../webpack.config.js')
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

// In production you should allow a web server
// like NGINX handle static files.
server.use(`/dist`, express.static(`dist`))
server.use(`/img`, express.static(`img`))

//TODO: Add server-side rendering of our Cycle app
server.get('/*', (req, res) => {
  if (isDeveloping) {
    res.sendFile(__dirname + '/index.dev.html')
  } else {
    res.sendFile(__dirname + '/index.html')
  }
})

let listener = server.listen(port, () => {
  const host = listener.address().address
  console.log('Example app listening at http://%s:%s', host, port)
  console.log('Node environment = ' + process.env.NODE_ENV)
})
