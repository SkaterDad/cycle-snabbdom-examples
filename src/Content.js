//import Rx from 'rx'
import isolate from '@cycle/isolate'
import Colors from './examples/ColorChange'
import Github from './examples/GithubSearch'
import HeroComplex from './examples/HeroComplex'
import HeroSimple from './examples/HeroSimple'
import HeroTests from './examples/HeroTests'

function mapContent(sources, val) {
  switch (parseInt(val)) {
  case 1:
    return Colors(sources)
  case 2:
    return isolate(Github)(sources)
  case 3:
    return HeroSimple(sources)
  case 4:
    return HeroComplex(sources)
  case 5:
    return HeroTests(sources)
  default:
    return Colors(sources)
  }
}

function Content(sources, toggle$) {
  const state$ = toggle$.map(val => {
    console.log('I\'m inside the content state mapping!')
    return mapContent(sources, val)
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

export default Content
