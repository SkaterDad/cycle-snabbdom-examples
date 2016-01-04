import Rx from 'rx'
import Cycle from '@cycle/core'
import {h, makeDOMDriver} from 'cycle-snabbdom'
import {makeHTTPDriver} from '@cycle/http'
import {makeHistoryDriver, filterLinks} from '@cycle/history'
import Content from './Content'

const header = h('header', {}, [
  h('a', {attrs: {href: '/'}}, 'Color Changer'),
  h('a', {attrs: {href: '/github'}}, 'Github Search'),
  h('a', {attrs: {href: '/hero-simple'}}, 'Hero Transition (Simple)'),
  h('a', {attrs: {href: '/hero-complex'}}, 'Hero Transition (Complex)'),
  h('a', {attrs: {href: '/hero-tests'}}, 'Hero Transition (Tests)'),
])

const view = (hdr, cont) =>
  h('div.app-wrapper', {}, [hdr, h('main.content-holder', {}, [cont])])

function main(sources) {
  //Link filtering
  const url$ = sources.DOM
    .select('a')
    .events('click')
    .filter(filterLinks)
    .map(event => event.target.pathname)

  const content = Content(sources)

  const view$ = Rx.Observable.just(view(header, content.DOM))

  return {DOM: view$, HTTP: content.HTTP, History: url$}
}

Cycle.run(main, {

  DOM: makeDOMDriver('#app-container', [
    require(`snabbdom/modules/class`),
    require(`./snabbdom_modules/hero`),
    require(`snabbdom/modules/style`),
    require(`snabbdom/modules/props`),
    require(`snabbdom/modules/attributes`),
  ]),
  HTTP: makeHTTPDriver(),
  History: makeHistoryDriver({hash: true, queries: false}),
})
