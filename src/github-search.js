import {h} from 'cycle-snabbdom'
import fadeInOutStyle from './global-styles'

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
  //Function param defaults think null is a good value...
  //Since these variables will placed directly inside their containers
  // (not wrapped in a <span> or anything), we must check if they are null
  // to avoid errors.
  //It would be less code to just wrap them in <span> or <p> tags,
  // but this illustrates an easy gotcha which wasn't fun to debug.
  const safeDescription = description === null ? 'No description given.' : description
  const safeLogin = owner.login === null ? '?' : owner.login

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
      safeLogin,
    ]),
    h('a.gh-link', {props: {href: html_url}}, [
      h('h1', {}, full_name),
      safeDescription,
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
    .startWith([])

  //TODO: Prevent this from having initial state when re-entering page.
  const vtree$ = searchResponse$
    .map(results =>
      h('div.page-wrapper', {key: `ghpage`, style: fadeInOutStyle}, [
        h('div.page.github-search-container', {}, [
          h('label.label', {}, 'Search:'),
          h('input.field', {props: {type: 'text'}}),
          h('hr'),
          h('section.search-results', {}, results.map(resultView)),
        ])
      ])
    )

  return {
    DOM: vtree$,
    HTTP: searchRequest$,
  }
}

export default githubSearch
