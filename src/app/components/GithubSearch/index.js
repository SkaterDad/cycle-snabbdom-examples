import xs from 'xstream'
import debounce from 'xstream/extra/debounce'
import {h} from '@cycle/dom'
import {fadeInOutStyle} from '../../global/styles'
import loadingSpinner from '../../global/loading.js'
import './styles.scss'

function resultView({
  id,
  html_url = 'https://github.com/',
  full_name = 'Unknown Repo Name',
  description = 'No description given.',
  owner = {
    html_url: 'https://github.com/',
    avatar_url: '',
    login: '?',
  }}) {
  const html = h('div.search-result', {
    key: id,
    style: {
      opacity: 0, transform: 'translateY(-100px)',
      delayed: {opacity: 1, transform: 'translateY(0px)'},
      remove: {opacity: 0, transform: 'translateY(-100px)'},
    },
  }, [
    h('a.gh-owner-link', {props: {href: owner.html_url}}, [
      h('img.gh-avatar',{props: {src: owner.avatar_url}}),
      owner.login,
    ]),
    h('a.gh-link', {props: {href: html_url}}, [
      h('h1', {}, full_name),
      description,
    ]),
  ])
  return html
}

function githubSearch({DOM, HTTP}, {search = ''}, pathname) {
  const GITHUB_SEARCH_API = 'https://api.github.com/search/repositories?q='
  //CAN USE THIS DURING TESTING -> const GITHUB_SEARCH_API = 'http://localhost:3000/mocksearch?q='

  //Query text
  const query$ = DOM.select('.field').events('input')
    .debug(() => {console.log(`GH input changed`)})
    .compose(debounce(500))
    .map(ev => ev.target.value.trim()) //added trim to reduce useless searches

  // Requests for Github repositories happen when the input field changes,
  // debounced by 500ms, ignoring empty input field.
  const searchRequest$ = query$
    .startWith(search)
    .filter(query => query.length > 0)
    .map(q => ({
      url: GITHUB_SEARCH_API + encodeURI(q),
      category: 'github',
    }))
    .debug((x) => console.log(`GH search request emitted: ${x}`))
    .remember()

  // Convert the stream of HTTP responses to virtual DOM elements.
  const searchResponse$ = HTTP
    .select('github')
    .flatten() //Needed because HTTP gives an Observable when you map it
    .map(res => res.body.items)
    .startWith([])
    .debug((x) => console.log(`GH search response emitted: ${x.length} items`))

  //loading indication.  true if request is newer than response
  const loading$ = xs.merge(searchRequest$.mapTo(true),searchResponse$.mapTo(false))
    .startWith(false)
    .compose(debounce(250))
    .debug((x) => console.log(`GH loading status emitted: ${x}`))

  //Combined state observable which triggers view updates
  const state$ = xs.combine(searchResponse$, loading$)
    .map(([res, loading]) => {
      return {results: res, loading: loading}
    })
    .debug(() => console.log(`GH state emitted`))

  //Convert state to DOM
  const vtree$ = state$
    .map(({results, loading}) =>
      h('div.page-wrapper', {key: `ghpage`, style: fadeInOutStyle}, [
        h('div.page.github-search-container', {}, [
          h('label.label', {}, 'Search Github Repos:'),
          h('input.field', {key: 'searchbox', props: {type: 'text', value: search}}),
          h('hr'),
          h('section.search-results', {}, results.map(resultView).concat(loading ? loadingSpinner() : null)),
        ]),
      ])
    )
    .debug(() => console.log(`GH DOM emitted`))

  return {
    DOM: vtree$,
    //Kickstart the HTTP sink with a blank string.
    //I'm doing this so the Server Rendering has something to 'take()'
    //Unless I put more info into the router config, it's going to be needed for
    //any component which has an HTTP stream that isn't used initially.
    HTTP: xs.merge(xs.of(''),searchRequest$),
    Query: query$.map(q => { return {pathname: pathname, search: `?search=${q}`}}), //This will make its way to the history driver to update the url w/ query parms
  }
}

export default githubSearch
