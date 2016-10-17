import xs from 'xstream'
import Content from './Content'
const ROOT_SELECTOR = '.app-container'

function extractPathName(event) {
  return event.target.pathname
}

//only capture link clicks which are on this domain
function filterLinks(event) {
  return event.target.hostname === 'localhost' //TODO: Find real hostname
}

const app = (sources) => {
  //Link filtering
  const linkClicks$ = sources.DOM
    .select('a')
    .events('click')
    .filter(filterLinks)
    .map(event => {
      event.preventDefault()
      return extractPathName(event)
    })
    .filter(x => !!x)

  //POST requests which need redirection.
  //Intercepting server 302,303 destination url isn't possible.
  //Set custom header key 'redirectUrl' with each post request that will require redirection.
  const serverRedirects$ = sources.HTTP
    .select()
    .filter(res$ => res$.request.method === 'POST')
    .flatten() //Needed because HTTP gives an Observable when you map it
    .debug(resp => {console.log('POST response', resp)})
    .filter(resp => resp.status === 200 && resp.req.header && resp.req.header.redirectUrl)
    .map(resp => resp.req.header.redirectUrl)

  //Combine the user & server initiated url changes
  const url$ = xs.merge(linkClicks$, serverRedirects$)
    .remember()

  const content = Content(sources, ROOT_SELECTOR)

  //some routes will emit query params, which need to update the browser's url bar
  const urlWithQuery$ = content.Query

  //Potential spot to wrap the route component with an overall layout.
  const view$ = content.DOM

  return {
    DOM: view$,
    HTTP: content.HTTP,
    History: xs.merge(url$ ,urlWithQuery$)
      .debug(x => {
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
