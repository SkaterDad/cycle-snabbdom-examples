import Rx from 'rx'
import {h} from 'cycle-snabbdom'
import {fadeInOutStyle} from '../global/styles'
import loadingSpinner from '../global/loading'

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
    }
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

function githubSearch({DOM, HTTP}) {
  const GITHUB_SEARCH_API = 'https://api.github.com/search/repositories?q='

  // Requests for Github repositories happen when the input field changes,
  // debounced by 500ms, ignoring empty input field.
  const searchRequest$ = DOM.select('.field').events('input')
    .do(() => {console.log(`GH input changed`)})
    .debounce(500)
    .map(ev => ev.target.value.trim()) //added trim to reduce useless searches
    .filter(query => query.length > 0)
    .map(q => GITHUB_SEARCH_API + encodeURI(q))
    .do((x) => console.log(`GH search request emitted: ${x}`))
    .share() //needed because multiple observables will subscribe

  // Convert the stream of HTTP responses to virtual DOM elements.
  const searchResponse$ = HTTP
    .filter(res$ => res$ && res$.request.url.indexOf(GITHUB_SEARCH_API) === 0)
    .flatMapLatest(x => x) //Needed because HTTP gives an Observable when you map it
    .map(res => res.body.items)
    .startWith([])
    .do((x) => console.log(`GH search response emitted: ${x.length} items`))
    .share() //needed because multiple observables will subscribe

  //loading indication.  true if request is newer than response
  const loading$ = searchRequest$.map(true).merge(searchResponse$.map(false))
    .startWith(false)
    .do((x) => console.log(`GH loading status emitted: ${x}`))

  //Combined state observable which triggers view updates
  const state$ = Rx.Observable.combineLatest(searchResponse$, loading$,
    (res, loading) => {
      return {results: res, loading: loading}
    })
    .do(() => console.log(`GH state emitted`))

  //TODO: Prevent this from having initial state when re-entering page.
  const vtree$ = state$
    .map(({results, loading}) =>
      h('div.page-wrapper', {key: `ghpage`, style: fadeInOutStyle}, [
        h('div.page.github-search-container', {}, [
          h('label.label', {}, 'Search:'),
          h('input.field', {props: {type: 'text'}}),
          h('hr'),
          h('section.search-results', {}, results.map(resultView).concat(loading ? loadingSpinner() : null)),
        ])
      ])
    )
    .do(() => console.log(`GH DOM emitted`))

  return {
    DOM: vtree$,
    HTTP: searchRequest$,
  }
}

export default githubSearch
