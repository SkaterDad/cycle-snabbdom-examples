import Content from './Content'
import {filterLinks} from '@cycle/history'
const ROOT_SELECTOR = '.app-container'

function extractPathName(event) {
  return event.target.pathname
}

const app = (sources) => {
  //Link filtering
  const url$ = sources.DOM
    .select('a')
    .events('click')
    .filter(filterLinks)
    .map(extractPathName)
    .filter(x => x)

  const content = Content(sources, ROOT_SELECTOR)

  const view$ = content.DOM

  return {DOM: view$, HTTP: content.HTTP, History: url$}
}

export default app
