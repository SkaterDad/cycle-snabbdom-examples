import Rx from 'rx'
import {h} from 'cycle-snabbdom'
import {checkRequestUrl} from '../global/utils'
import loadingSpinner from '../global/loading'
import {fadeInStyle} from '../global/styles'

function resultView({
  id,
  url = 'https://api.github.com/',
  full_name = 'Unknown Repo Name',
  description = 'No description given.',
  owner = {
    html_url: 'https://github.com/',
    avatar_url: '',
    login: '?',
  }}) {
  const html = h('article.hero.hero-item', {
    key: id,
    props: {
      detailUrl: url
    },
    //hero: {id: `repo${id}`},
  }, [
    h('img.hero', {props: {src: owner.avatar_url}, hero: {id: `repo${id}`}}),
    h('h1.hero.repo', {}, full_name),
    h('div.small', {}, description),
    h('div.small', {}, `by ${owner.login}`),
  ])
  return html
}

function heroList({HTTP}) {
  const GET_REQUEST_URL = 'https://api.github.com/users/cyclejs/repos'

  //Send HTTP request to get data for the page
  //.shareReplay(1) is needed because this observable
  //immediately emmits its value before anything can
  //subscribe to it.
  const dataRequest$ = Rx.Observable.just(GET_REQUEST_URL)
    .do(() => console.log(`Hero list: Search request subscribed`))
    .shareReplay(1)

  // Convert the stream of HTTP responses to virtual DOM elements.
  const dataResponse$ = HTTP
    .filter(res$ => checkRequestUrl(res$, GET_REQUEST_URL))
    .flatMapLatest(x => x) //Needed because HTTP gives an Observable when you map it
    .map(res => res.body)
    .startWith([])
    .do((x) => console.log(`Hero list: HTTP response emitted: ${x.length} items`))
    .share()

  //loading indication.  true if request is newer than response
  const loading$ = dataRequest$.map(true).merge(dataResponse$.map(false))
    .do((x) => console.log(`Hero List: loading status emitted: ${x}`))

  //Combined state observable which triggers view updates
  const state$ = Rx.Observable.combineLatest(dataResponse$, loading$,
    (res, loading) => {
      return {results: res, loading: loading}
    })
    .do(() => console.log(`Hero List: state emitted`))

  //Map state into DOM elements
  const vtree$ = state$
    .map(({results, loading}) =>
      h('div.page-wrapper', {key: `herolistpage`, style: fadeInStyle}, [
        h('div', {style: {height: '100%', overflow: 'auto'}}, [
          h('h1', {}, 'Repo List'),
          h('section.flex', {}, results.map(resultView).concat(loading ? loadingSpinner() : null)),
        ])
      ])
    )
    .do(() => console.log(`Hero list: DOM emitted`))

  return {
    DOM: vtree$,
    HTTP: dataRequest$,
  }
}

export default heroList
