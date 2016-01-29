import Content from './Content'
import {filterLinks} from '@cycle/history'
const ROOT_SELECTOR = '.app-container'

function extractPathName(event) {
  return event.target.pathname
}

const app = (sources) => {
  //Link filtering
  const linkClicks$ = sources.DOM
    .select('a')
    .events('click')
    .filter(filterLinks)
    .map(extractPathName)
    .filter(x => x)

  //POST requests which need redirection.
  //Intercepting server 302,303 destination url doesn't seem possible.
  //Set custom header key 'redirectUrl' with each post request that will require redirection.
  const serverRedirects$ = sources.HTTP
    .filter(res$ => res$.request.method === 'POST')
    .do(console.log('It seems we found the response to a POST request!'))
    .flatMap(x => x) //Needed because HTTP gives an Observable when you map it
    .filter(resp => resp.req.header && resp.req.header.redirectUrl)
    .map(resp => resp.req.header.redirectUrl)

  const url$ = linkClicks$.merge(serverRedirects$)

  const content = Content(sources, ROOT_SELECTOR)

  const view$ = content.DOM

  return {DOM: view$, HTTP: content.HTTP, History: url$}
}

export default app
