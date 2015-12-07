import Rx from 'rx'
import {h} from 'cycle-snabbdom'
import fadeInOutStyle from './global-styles'

function loadingSpinner() {
  return h('div.spinner-container', {style: fadeInOutStyle}, [
    h('div.spinner', [
      h('div.rect1'),
      h('div.rect2'),
      h('div.rect3'),
      h('div.rect4'),
      h('div.rect5'),
    ])
  ])
}

function resultView({
  id,
  html_url = 'https://github.com/',
  full_name = 'Unknown Repo Name',
  description = 'No description given.',
  owner = {
    html_url: 'https://github.com/',
    avatar_url: 'http://fullmurray.com/50/50',
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
    .debounce(500)
    .map(ev => ev.target.value.trim()) //added trim to reduce useless searches
    .filter(query => query.length > 0)
    .map(q => GITHUB_SEARCH_API + encodeURI(q))
    .distinctUntilChanged()

  // Convert the stream of HTTP responses to virtual DOM elements.
  const searchResponse$ = HTTP
    .filter(res$ => res$.request.url.indexOf(GITHUB_SEARCH_API) === 0)
    .flatMapLatest(x => x) //Needed because HTTP gives an Observable when you map it
    .map(res => res.body.items)
    .map(items => items.map(resultView))
    .startWith([])

  //loading indication.  true if request is newer than response
  const loading$ = searchRequest$.map(true).merge(searchResponse$.map(false))

  //Combined state observable which triggers view updates
  const state$ = Rx.Observable.combineLatest(searchResponse$, loading$,
    (res, loading) => {
      return {results: res, loading: loading}
    })

  //TODO: Prevent this from having initial state when re-entering page.
  const vtree$ = state$
    .map(({results, loading}) =>
      h('div.page-wrapper', {key: `ghpage`, style: fadeInOutStyle}, [
        h('div.page.github-search-container', {}, [
          h('label.label', {}, 'Search:'),
          h('input.field', {props: {type: 'text'}}),
          h('hr'),
          h('section.search-results', {}, results.concat(loading ? loadingSpinner() : '')),
        ])
      ])
    )

  return {
    DOM: vtree$,
    HTTP: searchRequest$,
  }
}

export default githubSearch
