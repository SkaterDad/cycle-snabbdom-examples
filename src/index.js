import Rx from 'rx'
import Cycle from '@cycle/core'
import {h, modules, makeDOMDriver} from 'cycle-snabbdom'
const {StyleModule, PropsModule, AttrsModule, ClassModule, HeroModule} = modules
import {makeHTTPDriver} from '@cycle/http'
import Content from './Content'

const header = h('header', {}, [
  h('span', {style: {marginRight: '1rem'}}, 'Example Chooser:'),
  h('select.switcher', {}, [
    h('option', {attrs: {value: 1, selected: true}}, 'Color Changer'),
    h('option', {attrs: {value: 2}}, 'Github Search'),
    h('option', {attrs: {value: 3}}, 'Hero Transition (Simple)'),
    h('option', {attrs: {value: 4}}, 'Hero Transition (Complex)'),
    h('option', {attrs: {value: 5}}, 'Hero Transition (Tests)'),
  ]),
])

const view = (hdr, cont) =>
  h('div.app-wrapper', {}, [hdr, h('main.content-holder', {}, [cont])])

function main(responses) {
  let toggle$ = responses.DOM.select('.switcher').events('change')
    .map(ev => ev.target.value)
    .startWith(0)
    .do((x) => {console.log(`Example Selector = ${x}`)})

  const content = Content(responses, toggle$)

  const view$ = Rx.Observable.just(view(header, content.DOM))

  return {DOM: view$, HTTP: content.HTTP}
}

Cycle.run(main, {
  DOM: makeDOMDriver('.app-wrapper', {
    modules: [StyleModule, PropsModule, AttrsModule, ClassModule, HeroModule],
  }),
  HTTP: makeHTTPDriver(),
})
