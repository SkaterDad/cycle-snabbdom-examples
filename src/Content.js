import routes from './routes'
import switchPath from 'switch-path'
import {h} from 'cycle-snabbdom'

const headerLinks = [
  {path: '/', text: 'Color Changer'},
  {path: '/github', text: 'Github Search'},
  {path: '/hero-simple', text: 'Hero Transition (Simple)'},
  {path: '/hero-complex', text: 'Hero Transition (Complex)'},
  {path: '/hero-tests', text: 'Hero Transition (Goofy)'},
]

function isCurrentRoute(link) {
  return link === window.location.pathname
}

const createLink = ({path, text}) =>
  h('a', {class: {active: isCurrentRoute(path)}, attrs: {href: path}}, text)

const header = () => h('header', {}, headerLinks.map(createLink))

const view = (cont, containerClass) =>
  h('div.' + containerClass, {}, [header(), h('main.content-holder', {}, [cont])])

const Content = (sources, PRIMARY_CONTAINER_CLASS) => {
  const route$ = sources.History
    //.startWith({pathname: '/'})
    .map(location => {
      //Pass current url into router to get the appropriate value
      const {value} = switchPath(location.pathname, routes)
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
    .shareReplay(1) //Hot Module Replacement needed this to be shareReplay(1) instead of just share()

  return {
    DOM: route$.pluck('DOM').map(x => view(x, PRIMARY_CONTAINER_CLASS))
      .do(() => {console.log('Content DOM plucked')}),
    HTTP: route$.pluck('HTTP')
      .do(() => {console.log('Content HTTP plucked')})
      .filter(x => x).flatMapLatest(x => x)
      .do(() => {console.log('Content HTTP filtered')}),
  }
}

export default Content
