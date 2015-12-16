//import Rx from 'rx'
import checkbox from './examples/checkbox'
import colors from './examples/color-change'
import github from './examples/github-search'
import hero from './examples/hero-transition'
import heroSimple from './examples/hero-simple'

function mapContent(responses, val) {
  switch (parseInt(val)) {
  case 0:
    return checkbox(responses)
  case 1:
    return colors(responses)
  case 2:
    return github(responses)
  case 3:
    return heroSimple(responses)
  case 4:
    return hero(responses)
  default:
    return checkbox(responses)
  }
}

function content(responses, toggle$) {
  const state$ = toggle$.map(val => {
    console.log('I\'m inside the content state mapping!')
    return mapContent(responses, val)
  })
    .do(x => {
      const hasDOM = x.DOM ? true : false
      const hasHTTP = x.HTTP ? true : false
      console.log(`Content state emitted - DOM: ${hasDOM}, HTTP: ${hasHTTP}`)
    })
    .share()

  return {
    DOM: state$.pluck('DOM')
      .do(() => {console.log('Content DOM plucked')}),
    HTTP: state$.pluck('HTTP')
      .do(() => {console.log('Content HTTP plucked')})
      .filter(x => x).flatMapLatest(x => x)
      .do(() => {console.log('Content HTTP filtered')}),
  }
}


export default content
