//import Rx from 'rx'
import checkbox from './examples/checkbox'
import colors from './examples/color-change'
import github from './examples/github-search'

function mapContent(responses, val) {
  switch (parseInt(val)) {
  case 0:
    return checkbox(responses)
  case 1:
    return colors(responses)
  case 2:
    return github(responses)
  default:
    return checkbox(responses)
  }
}

function content(responses, toggle$) { //eslint-disable-line
  const state$ = toggle$.map(val => {
    console.log('I\'m inside the content state mapping!') //eslint-disable-line
    return mapContent(responses, val)
  })
    .do(x => {
      const hasDOM = x.DOM ? true : false
      const hasHTTP = x.HTTP ? true : false
      console.log(`Content state emitted - DOM: ${hasDOM}, HTTP: ${hasHTTP}`)}) //eslint-disable-line
    .share()

  return {
    DOM: state$.pluck('DOM')
      .do(() => {console.log('Content DOM plucked')}), //eslint-disable-line
    HTTP: state$.pluck('HTTP')
      .do(() => {console.log('Content HTTP plucked')}) //eslint-disable-line
      .filter(x => x).flatMapLatest(x => x)
      .do(() => {console.log('Content HTTP filtered')}), //eslint-disable-line
  }
}


export default content
