import Cycle from '@cycle/core'
import {makeDOMDriver} from 'cycle-snabbdom'
import {makeHTTPDriver} from '@cycle/http'
import {makeHistoryDriver, filterLinks} from '@cycle/history'
import Content from './Content'
import '../css/app.scss' //webpack will process this

const PRIMARY_CONTAINER_CLASS = 'app-wrapper'

const main = (sources) => {
  //Link filtering
  const url$ = sources.DOM
    .select('a')
    .events('click')
    .filter(filterLinks)
    .map(event => event.target.pathname)

  const content = Content(sources, PRIMARY_CONTAINER_CLASS)

  const view$ = content.DOM //Rx.Observable.just(view(header, content.DOM))

  return {DOM: view$, HTTP: content.HTTP, History: url$}
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app-container', [
    require(`snabbdom/modules/class`),
    require(`snabbdom/modules/hero`),
    require(`snabbdom/modules/style`),
    require(`snabbdom/modules/props`),
    require(`snabbdom/modules/attributes`),
  ]),
  HTTP: makeHTTPDriver(),
  History: makeHistoryDriver({hash: false, queries: true}),
})

//Code to enable Webpack Hot Module Replacement.
if (module.hot) {
  module.hot.accept()

  module.hot.dispose(() => {
    //must manually remove our old DOM
    document.body.removeChild(document.getElementsByClassName(PRIMARY_CONTAINER_CLASS)[0])
    //snabbdom patches over the app container on initialization,
    //so we have to recreate it when hot loading
    let elemDiv = document.createElement('div')
    elemDiv.id = 'app-container'
    document.body.appendChild(elemDiv)
  })
}
