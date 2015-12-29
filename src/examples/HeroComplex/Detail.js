import Rx from 'rx'
import {h} from 'cycle-snabbdom'
import {checkRequestUrl} from '../../global/utils'
import {fadeInOutStyle} from '../../global/styles'
//import loadingSpinner from '../../global/loading'

function detailView({
  id,
  full_name = 'Unknown Repo Name',
  description = 'No description given.',
  stargazers_count = '?',
  language = '?',
  owner = {
    avatar_url: '',
    login: '?',
  }}) {
  const html = h('div.hero-detail.hero', {}, [
    h('img.hero-details-avatar.hero',{props: {src: owner.avatar_url}, hero: {id: `repo${id}`}}),
    h('h3', {}, owner.login),
    h('h1', {}, full_name),
    h('span', {}, `Stars: ${stargazers_count}  -  Language: ${language}`),
    h('p', {}, description),
    h('button.detail-close', {}, 'Back to List'),
  ])
  return html
}

function HeroDetail({HTTP}, repoUrl = 'https://api.github.com/repos/paldepind/snabbdom') {
  const GET_REQUEST_URL = repoUrl

  //Send HTTP request to get data for the page
  const searchRequest$ = Rx.Observable.just(GET_REQUEST_URL)
    .do((x) => console.log(`Hero Detail: Sent GET request to: ${x}`))

  // Convert the stream of HTTP responses to virtual DOM elements.
  const searchResponse$ = HTTP
    .filter(res$ => checkRequestUrl(res$, GET_REQUEST_URL))
    .flatMapLatest(x => x) //Needed because HTTP gives an Observable when you map it
    .map(res => res.body)
    .do(() => console.log(`Hero Detail: HTTP response emitted`))

  //Map current state to DOM elements
  const vtree$ = searchResponse$
    .filter(results => results) //ignore any null or undefined responses
    .map((results) =>
      h('div.page-wrapper', {key: `herodetailpage`, style: fadeInOutStyle}, [
        h('h1', {}, 'Repo Details'),
        h('div.page.hero-detail-container', {}, [
          detailView(results),
        ]),
      ])
    )
    .do(() => console.log(`Hero Detail: DOM emitted`))

  return {
    DOM: vtree$,
    HTTP: searchRequest$,
  }
}

export default HeroDetail
