import routes from './routes'
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

//Check link against currenty history driver location
function isCurrentRoute(link, location) {
  if (!location.pathname) {
    return false
  }
  if (link === '/') {
    return link === location.pathname
  }
  return location.pathname.indexOf(link) >= 0
}

const createLink = ({path, text}, location) =>
  h('a', {class: {active: isCurrentRoute(path, location)}, attrs: {href: path}}, text)

const header = (his) => h('header', {}, headerLinks.map(x => createLink(x, his)))

const view = (cont, rootSelector, location) =>
  h('div' + rootSelector, {}, [header(location), h('main.content-holder', {}, [cont])])

function getRouteValue(location, sources) {
  console.log.bind(location)
  //Pass current url into path matcher to get the appropriate value
  // match: The route component
  // values: Object of dynamic url segment values and query params
  const {match, values} = urlMapper.map(location.pathname, routes)
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
    DOM: route$.pluck('DOM').withLatestFrom(sources.History, (dom, location) => {return {dom, location}})
      .map(x => view(x.dom, ROOT_SELECTOR, x.location))
      .do(() => {console.log('Content DOM plucked')}),
    HTTP: route$.pluck('HTTP')
      .do(() => {console.log('Content HTTP plucked')})
      .filter(x => !!x).flatMapLatest(x => x)
      .do(() => {console.log('Content HTTP filtered')}),
  }
}

export default Content
