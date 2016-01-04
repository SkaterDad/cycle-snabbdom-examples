import routes from './routes'
import switchPath from 'switch-path'

function Content(sources) {
  const state$ = sources.History
    //.startWith({pathname: '/'})
    .map(location => {
      //temporary for testing
      console.dir(location)
      //Pass current url into router to get the appropriate value
      const {value} = switchPath(location.pathname, routes)
      console.dir(value)
      //If function returned, pass it the sources object
      if (typeof value === 'function') {
        return value(sources)
      }
      //else just return the route value, which must be DOM.
      return {DOM: value}
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
