import {h} from 'cycle-snabbdom'
import {fadeInOutStyle} from '../../global/styles'
import './styles.scss'

const HERO_ID_KITTY1 = 'heroKitty1'
const HERO_ID_KITTY2 = 'heroKitty2'
const HERO_H1 = 'heroH1'
const HERO_SPAN = 'heroSpan'
const HERO_P_FIXED = 'heroPFixed'
const HERO_P_PERCENT = 'heroPPercent'
const HERO_SHADOWY = 'heroShadowy'

const falseView =
  h('div.page-wrapper.false', {style: fadeInOutStyle}, [
    h('div.row', {}, [
      h('div.col', {}, [
        h('img.fixed.hero', {props: {src: 'img/kitty1.jpg'}, hero: {id: HERO_ID_KITTY1}}),
        h('p.hero', {hero: {id: HERO_P_FIXED}}, 'Image with fixed sizing.'),
      ]),
      h('div.col', {}, [
        h('img.percent.hero', {props: {src: 'img/kitty2.jpg'}, hero: {id: HERO_ID_KITTY2}}),
        h('p.hero', {hero: {id: HERO_P_PERCENT}}, 'Image with percent sizing.'),
      ]),
      h('div.col.whitetext', {}, [
        h('h1.hero', {hero: {id: HERO_H1}}, 'Big Text.'),
        h('div.shadowy1.hero', {hero: {id: HERO_SHADOWY}}, []),
      ]),
      h('div.col', {}, [
        h('span.small.hero', {hero: {id: HERO_SPAN}}, 'Small text.'),
        h('p', {}, 'Left justified'),
      ]),
    ]),
  ])

const trueView =
  h('div.page-wrapper.true', {style: fadeInOutStyle}, [
    h('div', {style: {height: '150px', background: 'red'}}, []),
    h('div.row', {}, [
      h('div.col', {}, [
        h('img.fixed.hero', {props: {src: 'img/kitty2.jpg'}, hero: {id: HERO_ID_KITTY2}}),
        h('p.hero', {hero: {id: HERO_P_FIXED}}, 'Image with fixed sizing.'),
      ]),
      h('div.col-center', {}, [
        h('span.small.hero', {hero: {id: HERO_SPAN}}, 'Small text.'),
        h('p', {}, 'Centered'),
      ]),
      h('div.col', {}, [
        h('p.hero', {hero: {id: HERO_P_PERCENT}}, 'Image with percent sizing.'),
        h('img.percent.hero', {props: {src: 'img/kitty1.jpg'}, hero: {id: HERO_ID_KITTY1}}),
      ]),
      h('div.col-right', {}, [
        h('div.shadowy2.hero', {hero: {id: HERO_SHADOWY}}, []),
        h('h1.hero.small', {hero: {id: HERO_H1}}, 'Big Text.'),
      ]),
    ]),
  ])

const view = (value) =>
  h('div.heroTests', {}, [
    h('input.clickme', {props: {type: 'checkbox'}}),
    'Click Me!',
    h('div', {style: {position: 'relative'}}, [
      value ? trueView : falseView,
    ]),
  ])

function HeroTests({DOM}) {
  let checked$ = DOM.select('.clickme').events('change')
      .map(ev => ev.target.checked)
      .startWith(false)

  let vTree$ = checked$.map(view)

  return {DOM: vTree$}
}

export default HeroTests
