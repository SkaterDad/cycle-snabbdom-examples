let Cycle = require('@cycle/core')
let {
  html,
  head,
  title,
  link,
  body,
  meta,
  script,
  makeHTMLDriver,
} = require('cycle-snabbdom')
let {makeHTTPDriver} = require('@cycle/http')
let {makeServerHistoryDriver} = require('@cycle/history')
let app = require('../app/app').default

function headParts(isDevMode) {
  const baseHead = [
    meta({attrs: {charset: 'utf-8'}}),
    meta({attrs: {name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0'}}),
    meta({attrs: {name: 'description', content: 'Cycle.js Snabbdom Examples'}}),
    title('Cycle.js Snabbdom Examples'),
  ]

  if (!isDevMode) {
    return baseHead.concat(
      link({attrs: {rel: 'stylesheet', href: './dist/bundle.css'}})
    )
  }

  return baseHead
}

function wrapVTreeWithHTMLBoilerplate(vtree, isDevMode) {
  return html([
    head(headParts(isDevMode)),
    body([
      vtree,
      //script({attrs: {src: './dist/bundle.js'}}),
    ]),
  ])
}

function prependHTML5Doctype(appHTML) {
  return `<!doctype html>${appHTML}`
}

function wrapAppResultWithBoilerplate(appFn, {domToTake, httpToTake, isDevMode}) {
  return function wrappedAppFn(sources) {
    const theApp = appFn(sources)
    return {
      DOM: theApp.DOM.take(domToTake).map(wrapVTreeWithHTMLBoilerplate, isDevMode),
      HTTP: theApp.HTTP.take(httpToTake),
      History: theApp.History,
    }
  }
}

let serverApp = (req, res) => {
  //Prepare Cycle.js app for Server Rendering
  //In this case, we wrap the app's vTree with the full page HTML.

  //TODO: Add some of this information to the route definitions, then read them here.
  const ssrOptions = {
    domToTake: 1,
    httpToTake: 1, //potentially tie this to route defs.  some routes don't have HTTP
    isDevMode: process.env.NODE_ENV !== 'production',
  }

  let wrappedAppFn = wrapAppResultWithBoilerplate(app, ssrOptions)

  console.log('Server rendering!')

  //Run the Cycle app.
  let cycleApp = Cycle.run(wrappedAppFn, {
    DOM: makeHTMLDriver(),
    HTTP: makeHTTPDriver(),
    History: makeServerHistoryDriver({pathname: req.url}),
  })
  let sources = cycleApp.sources

  //Subscribe to the HTML Driver events
  //HTML driver returns a string representation of the vTree
  //When the string is emitted, send the HTML response to the client.
  let html$ = sources.DOM.map(prependHTML5Doctype)
  html$.subscribe(appHTML => {
    //As if by magic, this knows when your DOM is done being updated.
    //To illustrate this, the repo-list.js component emmits the DOM 4 times.
    //This log message only happens once, after all the DOM updates are done!
    //I made the HTTP request delayed by 1000ms, and this still only replied at the end.
    console.log(`${new Date().toString()} - Sending HTML reply!`)
    res.send(appHTML)
  })
}

module.exports = serverApp

if (module.hot) {
  module.hot.accept('../app/app', () => {
    app = require('../app/app').default
  })
}
