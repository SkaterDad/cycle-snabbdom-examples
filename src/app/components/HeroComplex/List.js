import xs from 'xstream'
import {h} from '@cycle/dom'
import {checkRequestUrl} from '../../global/utils'
import loadingSpinner from '../../global/loading'
import {fadeInStyle} from '../../global/styles'
import './styles.scss'

function resultView({
  id,
  full_name = 'Unknown Repo Name',
  description = 'No description given.',
  owner = {
    avatar_url: '',
    login: '?',
  }}) {
  return h('a.hero.hero-item', {
    key: id,
    attrs: {href: '/hero-complex/' + full_name},
    //hero: {id: `repo${id}`},
  }, [
    h('img.hero', {props: {src: owner.avatar_url}, hero: {id: `repo${id}`}}),
    h('h1.hero.repo', {}, full_name),
    h('div.small', {}, description),
    h('div.small', {}, `by ${owner.login}`),
  ])
}

function HeroList({HTTP}) {
  const GET_REQUEST_URL = 'http://localhost:3000/data' //'https://api.github.com/users/cyclejs/repos'

  //Send HTTP request to get data for the page
  //.shareReplay(1) is needed because this observable
  //immediately emmits its value before anything can
  //subscribe to it.
  const dataRequest$ = xs
    .of({
      url: GET_REQUEST_URL,
      category: 'hero-list',
    })
    .debug(() => console.log(`Hero list: Search request subscribed`))
    .remember()

  // Convert the stream of HTTP responses to virtual DOM elements.
  const dataResponse$ = HTTP
    .select('hero-list')
    .filter(res$ => {
      console.dir(res$)
      return checkRequestUrl(res$, GET_REQUEST_URL)
    })
    .flatten() //Needed because HTTP gives an Observable when you map it
    .map(res => res.body)
    .startWith([])
    .debug((x) => console.log(`Hero list: HTTP response emitted: ${x.length} items`))

  //loading indication.  true if request is newer than response
  const loading$ = xs.merge(dataRequest$.mapTo(true), dataResponse$.mapTo(false))
    .debug((x) => console.log(`Hero List: loading status emitted: ${x}`))

  //Combined state observable which triggers view updates
  const state$ = xs.combine(dataResponse$, loading$)
    .map(([res, loading]) => {
      return {results: res, loading: loading}
    })
    .debug(() => console.log(`Hero List: state emitted`))

  //Map state into DOM elements
  const vtree$ = state$
    .map(({results, loading}) =>
      h('div.page-wrapper', {key: `herolistpage`, style: fadeInStyle}, [
        h('div', {style: {height: '100%', overflow: 'auto'}}, [
          h('h1', {}, 'Cyclejs Repo List'),
          h('section.flex', {}, results.map(resultView).concat(loading ? loadingSpinner() : null)),
        ]),
      ])
    )
    .debug(() => console.log(`Hero list: DOM emitted`))

  return {
    DOM: vtree$,
    HTTP: dataRequest$,
  }
}

export default HeroList
