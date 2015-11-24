import {h} from 'cycle-snabbdom'

function resultView(result) {
  return h('div.search-result', {
    key: result.id,
    props: {href: result.html_url},
    style: {
      opacity: 0,
      delayed: {opacity: 1},
      remove: {opacity: 0, transform: 'translateY(-100px)'},
    }
  }, [
    h('a.gh-link', {}, result.full_name),
    ` by @${result.owner.login}`
  ])
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
  const vtree$ = HTTP
    .filter(res$ => res$.request.url.indexOf(GITHUB_SEARCH_API) === 0)
    .flatMap(x => x) //Needed because HTTP gives an Observable when you map it
    .map(res => res.body.items)
    .startWith([])
    .map(results =>
      h('div.wrapper', {}, [
        h('label.label', {}, 'Search:'),
        h('input.field', {props: {type: 'text'}}),
        h('hr'),
        h('section.search-results', {}, results.map(resultView)),
      ])
    )

  return {
    DOM: vtree$,
    HTTP: searchRequest$,
  }
}

export default githubSearch
