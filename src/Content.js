import routes from './routes'
//import switchPath from 'switch-path'
import Mapper from 'url-mapper'
import {h} from 'cycle-snabbdom'

//Initialize url mapper
const urlMapper = Mapper()

const headerLinks = [
  {path: '/', text: 'Color Changer'},
  {path: '/github', text: 'Github Search!'},
  {path: '/hero-simple', text: 'Hero Transition (Simple)'},
  {path: '/hero-complex', text: 'Hero Transition (Complex)'},
  {path: '/hero-tests', text: 'Hero Transition (Goofy)'},
]

//TODO: This probably won't work server side if we try that.
function isCurrentRoute(link) {
  if (link === '/') {
    return link === window.location.pathname
  }
  return window.location.pathname.indexOf(link) >= 0
}

const createLink = ({path, text}) =>
  h('a', {class: {active: isCurrentRoute(path)}, attrs: {href: path}}, text)

const header = () => h('header', {}, headerLinks.map(createLink))

const view = (cont, rootSelector) =>
  h('div' + rootSelector, {}, [header(), h('main.content-holder', {}, [cont])])

function getRouteValue(location, sources) {
  console.log.bind(location)
  //Pass current url into router to get the appropriate value
  const {match, values} = urlMapper.map(location.pathname, routes)
  console.log.bind(match)
  console.log.bind(values)
  //If function returned, pass it the sources object
  if (typeof match === 'function') {
    return match(sources, values)
  }
  //else just return the route value, which must be DOM.
  return {DOM: match}
}

const Content = (sources, ROOT_SELECTOR) => {
  const route$ = sources.History
    .map(location => getRouteValue(location, sources))
    .do(x => {
      const hasDOM = x.DOM ? true : false
      const hasHTTP = x.HTTP ? true : false
      console.log(`Content state emitted - DOM: ${hasDOM}, HTTP: ${hasHTTP}`)
    })
    .shareReplay(1) //Hot Module Replacement needed this to be shareReplay(1) instead of just share()

  return {
    DOM: route$.pluck('DOM').map(x => view(x, ROOT_SELECTOR))
      .do(() => {console.log('Content DOM plucked')}),
    HTTP: route$.pluck('HTTP')
      .do(() => {console.log('Content HTTP plucked')})
      .filter(x => x).flatMapLatest(x => x)
      .do(() => {console.log('Content HTTP filtered')}),
  }
}

export default Content
