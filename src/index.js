import Cycle from '@cycle/core'
import {makeDOMDriver} from 'cycle-snabbdom'
import {makeHTTPDriver} from '@cycle/http'
import {makeHistoryDriver} from '@cycle/history'
import app from './app'
import '../css/app.scss' //webpack will process this

const ROOT_SELECTOR = '.app-container'

const drivers = {
  DOM: makeDOMDriver(ROOT_SELECTOR, [
    require(`snabbdom/modules/class`),
    require(`snabbdom/modules/hero`),
    require(`snabbdom/modules/style`),
    require(`snabbdom/modules/props`),
    require(`snabbdom/modules/attributes`),
  ]),
  HTTP: makeHTTPDriver(),
  History: makeHistoryDriver({hash: false, queries: true}),
}

Cycle.run(app, drivers)

//Code to enable Webpack Hot Module Replacement.
if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    /*
      SNABBDOM-SPECIFIC WORKAROUND
      ----------------------------
      If your Cycle app vTree's root element has a different selector (class/id) than
      the original selector passed into makeDOMDriver(), you will need to uncomment
      the code below to recreate the original container.  This scenario is likely
      to come up if you are migrating your app from using @cycle/dom to cycle-snabbdom.
      The Virtual-DOM library leaves the original container alone, while Snabbdom replaces it.

      Alternatively, make your root element the same as the original container in your html.
      This project uses this method.
      index.html -> body -> <div class="app-container"></div>
      Cycle app vTree root element = div('.app-container', {...}, [...])

      //must manually remove our old DOM
      document.body.removeChild(document.getElementsByClassName(PRIMARY_CONTAINER_CLASS)[0])
      //snabbdom patches over the app container on initialization,
      //so we have to recreate it when hot loading
      let elemDiv = document.createElement('div')
      elemDiv.id = 'app-container'
      document.body.appendChild(elemDiv)
    */
  })
}
