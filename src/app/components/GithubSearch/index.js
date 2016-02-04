import Rx from 'rx'
import {h} from 'cycle-snabbdom'
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

  //Convert state to DOM
  const vtree$ = state$
    .map(({results, loading}) =>
      h('div.page-wrapper', {key: `ghpage`, style: fadeInOutStyle}, [
        h('div.page.github-search-container', {}, [
          h('label.label', {}, 'Search Github Repos:'),
          h('input.field', {props: {type: 'text'}}),
          h('hr'),
          h('section.search-results', {}, results.map(resultView).concat(loading ? loadingSpinner() : null)),
        ]),
      ])
    )
    .do(() => console.log(`GH DOM emitted`))

  return {
    DOM: vtree$,
    //Kickstart the HTTP sink with a blank string.
    //I'm doing this so the Server Rendering has something to 'take()'
    //Unless I put more info into the router config, it's going to be needed for
    //any component which has an HTTP stream that isn't used initially.
    HTTP: Rx.Observable.just('').merge(searchRequest$),
  }
}

export default githubSearch
