//import Rx from 'rx'
import Cycle from '@cycle/core'
import {makeHTTPDriver} from '@cycle/http'
import {h, makeDOMDriver} from 'cycle-snabbdom'
import colorChange from './color-change'
import github from './github-search'

//list of available examples
const examples = [
  {value: 'colors', text: 'Magic Color Changer'},
  {value: 'github', text: 'Github HTTP Search'},
]

//individual options for example selection
const optionDef = (example) => {
  return h('option',
    {props: {value: example.value}},
    example.text)
}

//top header which contains example selector
const headerDOM =
  h('header', [
    h('select.examples', {},
      examples.map(optionDef)
    )]
  )

const view = (header, content) =>
  h('div.app-wrapper', {}, [header, content])

function main(responses) {
  //which example to run?
  const selection$ = responses.DOM.select('select.examples').events('change')
    .map(ev => ev.target.value)
    .startWith(examples[0].value)

  //observable of nested dialogues, which have observable return values
  const content$ = selection$
    .map(sel => {
      switch (sel) {
      case 'github':
        return github(responses)
      default:
        return colorChange(responses)
      }
    })

  //build full DOM
  const view$ = content$
    .filter(dialogue => dialogue.DOM)
    .flatMapLatest(dialogue => dialogue.DOM)
    .map((cDOM) => view(headerDOM, cDOM))

  //http requests - if exists
  const http$ = content$
    .filter(dialogue => dialogue.HTTP)
    .flatMapLatest(dialogue => dialogue.HTTP)

  //build object to return
  return {
    DOM: view$,
    HTTP: http$,
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app-container'),
  HTTP: makeHTTPDriver(),
})
