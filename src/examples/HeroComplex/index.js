//import Rx from 'rx'
import List from './List'
import Detail from './Detail'

function mapContent(sources, action) {
  switch (action.view) {
  case 'list':
    console.log(`Hero: Show the list view!`)
    return List(sources)
  case 'details':
    console.log(`Hero: Show the details view!`)
    return Detail(sources, action.url)
  default:
    console.log(`Hero: Show the list view! (default)`)
    return List(sources)
  }
}

function HeroComplex(sources) {
  //User intents
  const listItemClick$ = sources.DOM.select('.hero-item').events('click')
    .map(ev => {
      return {
        view: `details`,
        url: ev.currentTarget.detailUrl,
      }
    })

  const detailCloseClick$ = sources.DOM.select('.detail-close').events('click')
    .map(() => {
      return {
        view: `list`,
      }
    })

  const action$ = listItemClick$.merge(detailCloseClick$)
    .startWith({view: `list`})

  const state$ = action$
    .map(action => mapContent(sources, action))
    .shareReplay(1)

  const heroContent = {
    DOM: state$.filter(x => x.DOM).map(x => x.DOM)
      .do(() => {console.log('Hero: Content DOM mapped')}),
    HTTP: state$.filter(x => x.HTTP).map(x => x.HTTP)
      .do(() => {console.log('Hero: Content HTTP mapped')})
      .filter(x => x).flatMapLatest(x => x)
      .do(() => {console.log('Hero: Content HTTP filtered')}),
  }

  return heroContent //sinks
}

export default HeroComplex
