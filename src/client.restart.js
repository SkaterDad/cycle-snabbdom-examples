//App-Level Stylesheets
import 'normalize.css'
import './app/app.scss'

import Cycle from '@cycle/core'
import {modules, makeDOMDriver} from 'cycle-snabbdom'
const {StyleModule, PropsModule, AttrsModule, ClassModule, HeroModule} = modules
import {makeHTTPDriver} from '@cycle/http'
import {makeHistoryDriver} from '@cycle/history'

import isolate from '@cycle/isolate'
import {restart, restartable} from 'cycle-restart'

let app = require('./app/app').default

//Define selector string of root vTree element.
//See the (module.hot) section below for explanation.
const ROOT_SELECTOR = '.app-container'

//Define what drivers our Cycle app will use
const drivers = {
  DOM: restartable(makeDOMDriver(ROOT_SELECTOR, {
    modules: [StyleModule, PropsModule, AttrsModule, ClassModule, HeroModule],
  }), {pauseSinksWhileReplaying: false}),
  HTTP: restartable(makeHTTPDriver()),
  History: restartable(makeHistoryDriver({hash: false, queries: true}), {pauseSinksWhileReplaying: true}),
}

//Initialize Cycle.js!
const {sinks, sources} = Cycle.run(app, drivers)

//Code to enable Webpack Hot Module Replacement.
if (module.hot) {
  module.hot.accept('./app/app', () => {
    //reassign 'app' variable to the updated version
    app = require('./app/app').default
    //restart the cycle app
    restart(app, drivers, {sinks, sources}, isolate)
  })
  // module.hot.dispose(() => {
  //   /*
  //     SNABBDOM-SPECIFIC WORKAROUND
  //     ----------------------------
  //     If your Cycle app vTree's root element has a different selector (class/id) than
  //     the original selector passed into makeDOMDriver(), you will need to uncomment
  //     the code below to recreate the original container.  This scenario is likely
  //     to come up if you are migrating your app from using @cycle/dom to cycle-snabbdom.
  //     The Virtual-DOM library leaves the original container alone, while Snabbdom replaces it.

  //     Alternatively, make your root element the same as the original container in your html.
  //     This project uses this method.
  //     index.html -> body -> <div class="app-container"></div>
  //     Cycle app vTree root element = div('.app-container', {...}, [...])

  //     //must manually remove our old DOM
  //     document.body.removeChild(document.getElementsByClassName(PRIMARY_CONTAINER_CLASS)[0])
  //     //snabbdom patches over the app container on initialization,
  //     //so we have to recreate it when hot loading
  //     let elemDiv = document.createElement('div')
  //     elemDiv.id = 'app-container'
  //     document.body.appendChild(elemDiv)
  //   */
  // })
}
