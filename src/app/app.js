import Rx from 'rx'
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
  //Intercepting server 302,303 destination url isn't possible.
  //Set custom header key 'redirectUrl' with each post request that will require redirection.
  const serverRedirects$ = sources.HTTP
    .filter(res$ => res$.request.method === 'POST')
    .flatMap(x => x) //Needed because HTTP gives an Observable when you map it
    .filter(resp => resp.req.header && resp.req.header.redirectUrl)
    .map(resp => resp.req.header.redirectUrl)

  //Combine the user & server initiated url changes
  const url$ = Rx.Observable.merge(linkClicks$, serverRedirects$)
    .shareReplay(1)

  const content = Content(sources, ROOT_SELECTOR)

  //some routes will emit query params, which need to update the browser's url bar
  const urlWithQuery$ = content.Query

  //Potential spot to wrap the route component with an overall layout.
  const view$ = content.DOM

  return {
    DOM: view$,
    HTTP: content.HTTP,
    History: Rx.Observable.merge(url$ ,urlWithQuery$)
      .do(x => {
        try {
          console.log(`*** New url info sent to History driver *** ${JSON.stringify(x)}`)
        } catch (error) {
          console.log(`Error converting this to JSON`)
          console.dir(x)
        }
      }),
  }
}

export default app
