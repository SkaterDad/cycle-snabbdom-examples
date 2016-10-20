import xs from 'xstream'
import {h} from '@cycle/dom'
import {checkRequestUrl} from '../../global/utils'
import {fadeInOutStyle} from '../../global/styles'
//import loadingSpinner from '../../global/loading'
import './styles.scss'

function detailView({
  id,
  full_name = 'Unknown Repo Name',
  description = 'No description given.',
  stargazers_count = '?',
  language = '?',
  html_url = 'http://github.com/',
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
    h('a', {attrs: {href: html_url}}, 'Check it out on Github!'),
  ])
  return html
}

function HeroDetail({HTTP}, values = {owner: 'cyclejs', repo: 'cyclejs'}) {
  //create the api url from values passed from Url-Mapper
  const GET_REQUEST_URL = 'https://api.github.com/repos/' + values.owner + '/' + values.repo

  //Send HTTP request to get data for the page
  const searchRequest$ = xs
    .of({
      url: GET_REQUEST_URL,
      category: 'hero-detail',
    })
    .debug((x) => console.log(`Hero Detail: Sent GET request to: ${x.url}`))
    .remember()

  // Convert the stream of HTTP responses to virtual DOM elements.
  const searchResponse$ = HTTP
    .select('hero-detail')
    .filter(res$ => checkRequestUrl(res$, GET_REQUEST_URL))
    .flatten() //Needed because HTTP gives an Observable when you map it
    .map(res => res.body)
    .debug(() => console.log(`Hero Detail: HTTP response emitted`))

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
    .debug(() => console.log(`Hero Detail: DOM emitted`))

  return {
    DOM: vtree$,
    HTTP: searchRequest$,
  }
}

export default HeroDetail
