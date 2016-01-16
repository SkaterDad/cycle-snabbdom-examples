import Cycle from '@cycle/core'
import {makeDOMDriver} from 'cycle-snabbdom'
import {makeHTTPDriver} from '@cycle/http'
import {makeHistoryDriver} from '@cycle/history'
let app = require('./app').default
import 'normalize.css'
import '../css/app.scss' //webpack will process this

//packages needed for hot reloading w/ preserved state
import isolate from '@cycle/isolate'
import {restart, restartable} from 'cycle-restart'

const ROOT_SELECTOR = '.app-container'

const snabbdomModules = [
  require(`snabbdom/modules/class`),
  require(`snabbdom/modules/hero`),
  require(`snabbdom/modules/style`),
  require(`snabbdom/modules/props`),
  require(`snabbdom/modules/attributes`),
]

const drivers = {
  DOM: restartable(makeDOMDriver(ROOT_SELECTOR, snabbdomModules), {pauseSinksWhileReplaying: false}),
  HTTP: restartable(makeHTTPDriver()),
  History: restartable(makeHistoryDriver({hash: false, queries: true}), {pauseSinksWhileReplaying: true}),
}

const {sinks, sources} = Cycle.run(app, drivers)

//Code to enable Webpack Hot Module Replacement.
if (module.hot) {
  module.hot.accept('./app', () => {
    app = require('./app').default
    restart(app, drivers, {sinks, sources}, isolate)
  })
}
