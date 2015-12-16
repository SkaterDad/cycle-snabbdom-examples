//import Rx from 'rx'
import list from './hero-list'
import detail from './hero-detail'

function mapContent(responses, action) {
  switch (action.view) {
  case 'list':
    console.log(`Hero: Show the list view!`)
    return list(responses)
  case 'details':
    console.log(`Hero: Show the details view!`)
    return detail(responses, action.url)
  default:
    console.log(`Hero: Show the list view! (default)`)
    return list(responses)
  }
}

function heroTransition(responses) {
  //User intents
  const listItemClick$ = responses.DOM.select('.hero-item').events('click')
    .filter(ev => ev.target.detailUrl)
    .map(ev => {
      return {
        view: `details`,
        url: ev.target.detailUrl,
      }
    })

  const detailCloseClick$ = responses.DOM.select('.detail-close').events('click')
    .map(() => {
      return {
        view: `list`,
      }
    })

  const action$ = listItemClick$.merge(detailCloseClick$)
    .startWith({view: `list`})

  const state$ = action$
    .map(action => mapContent(responses, action))
    .shareReplay(1)

  const heroContent = {
    DOM: state$.filter(x => x.DOM).map(x => x.DOM)
      .do(() => {console.log('Hero: Content DOM mapped')}),
    HTTP: state$.filter(x => x.HTTP).map(x => x.HTTP)
      .do(() => {console.log('Hero: Content HTTP mapped')})
      .filter(x => x).flatMapLatest(x => x)
      .do(() => {console.log('Hero: Content HTTP filtered')}),
  }

  return heroContent
}

export default heroTransition
