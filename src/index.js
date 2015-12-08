import Rx from 'rx'
import Cycle from '@cycle/core'
import {h, makeDOMDriver} from 'cycle-snabbdom'
import {makeHTTPDriver} from '@cycle/http'
import content from './content'

const header = h('header', {}, [
  h('span', {style: {marginRight: '1rem'}}, 'Example Chooser:'),
  h('select.switcher', {}, [
    h('option', {attrs: {value: 0, selected: true}}, 'Checkbox'),
    h('option', {attrs: {value: 1}}, 'Color Changer'),
    h('option', {attrs: {value: 2}}, 'Github Search'),
  ]),
])

// function header(responses) { //eslint-disable-line
//   return {DOM: Rx.Observable.just(h('header', {}, [
//     h('span', {style: {marginRight: '1rem'}}, 'Example Chooser:'),
//     h('select.switcher', {}, [
//       h('option', {attrs: {value: 0, selected: true}}, 'Checkbox'),
//       h('option', {attrs: {value: 1}}, 'Color Changer'),
//       h('option', {attrs: {value: 2}}, 'Github Search'),
//     ]),
//   ])).do(() => { console.log(`Header DOM emitted`)}) //eslint-disable-line
//   }
// }

const view = (hdr, cont) =>
  h('div.app-wrapper', {}, [hdr, h('main.content-holder', {}, [cont])])

function main(responses) {
  let toggle$ = responses.DOM.select('.switcher').events('change')
    .map(ev => ev.target.value)
    .startWith(0)
    .do((x) => {console.log(`Example Selector = ${x}`)}) //eslint-disable-line

  //const theHeader = header(responses)
  const theContent = content(responses, toggle$)

  const view$ = Rx.Observable.just(view(header, theContent.DOM))

  return {DOM: view$, HTTP: theContent.HTTP}
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app-container'),
  HTTP: makeHTTPDriver(),
})
