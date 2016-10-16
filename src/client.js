//App-Level Stylesheets
import 'normalize.css'
import './app/app.scss'

//import xs from 'xstream'
import {run} from '@cycle/xstream-run'
import {makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import {makeHistoryDriver} from '@cycle/history'
import {createHistory} from 'history'
import app from './app/app'

//need Hero module, so we have to import all of the others also
const ClassModule = require('snabbdom/modules/class')
const PropsModule = require('snabbdom/modules/props')
const AttrsModule = require('snabbdom/modules/attributes')
const StyleModule = require('snabbdom/modules/style')
const HeroModule = require('snabbdom/modules/hero')

//Define selector string of root vTree element.
//See the (module.hot) section below for explanation.
const ROOT_SELECTOR = '.app-container'

//Initialize the History object which the driver will use
const history = createHistory()

//Define what drivers our Cycle app will use
const drivers = {
  DOM: makeDOMDriver(ROOT_SELECTOR, {
    transposition: true,
    modules: [StyleModule, PropsModule, AttrsModule, ClassModule, HeroModule],
  }),
  HTTP: makeHTTPDriver(),
  History: makeHistoryDriver(history),
}

//Initialize Cycle.js!
run(app, drivers)

//Code to enable Webpack Hot Module Replacement.
if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    /*
      SNABBDOM-SPECIFIC WORKAROUND (TODO: CONFIRM THIS IS STILL A PROBLEM)
      ----------------------------
      If your Cycle app vTree's root element has a different selector (class/id) than
      the original selector passed into makeDOMDriver(), you will need to uncomment
      the code below to recreate the original container.  This scenario is likely
      to come up if you are migrating your app from using @cycle/dom to cycle-snabbdom.
      The Virtual-DOM library leaves the original container alone, while Snabbdom replaces it.

      Recommendation: Make your root element the same as the original container in your html.
      index.html -> body -> <div class="app-container"></div>
      Cycle app vTree root element = div('.app-container', {...}, [...])
    */
  })
}
