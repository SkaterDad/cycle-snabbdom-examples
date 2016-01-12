import {h} from 'cycle-snabbdom'
import {fadeInOutStyle} from '../../global/styles'

const HERO_ID = 'test-hero-simple'
const HERO_TEXT = 'HERO'

const falseView =
  h('div.falsebox.hero',
    {
      style: {
        position: 'absolute', //needed because the two boxes must overlap during transition
        width: '100px', height: '100px',
        backgroundColor: 'rgb(255,107,64)',
        margin: '1rem', padding: '1rem',
        borderRadius: '3px',
        boxShadow: '1px 1px 2px 0px black',
        opacity: '0',
        delayed: {opacity: '1'},
        remove: {opacity: '0'},
      },
    }, [
      h('span.falsetext.hero', {hero: {id: HERO_ID}}, HERO_TEXT),
    ]
  )

const trueView =
  h('div.truebox.hero',
    {
      style: {
        position: 'absolute', //needed because the two boxes must overlap during transition
        width: '300px', height: '200px',
        backgroundColor: 'rgb(123,73,17)',
        margin: '5rem', padding: '1rem',
        borderRadius: '3px',
        boxShadow: '1px 1px 2px 0px black',
        opacity: '0',
        delayed: {opacity: '1'},
        remove: {opacity: '0'},
      },
    }, [
      h('span.truetext.hero', {hero: {id: HERO_ID}}, HERO_TEXT),
    ]
  )

const view = (toggled) =>
  h('div.page',
    {key: 'heroSimplePage', style: fadeInOutStyle},
    [
      h('input#box1', {props: {type: 'checkbox'}}),
      'Toggle me',
      h('div#box-wrapper', {style: {position: 'relative'}}, [toggled ? trueView : falseView]),
    ])

const HeroSimple = ({DOM}) => {
  let vTree$ =
    DOM.select('input').events('change')
      .map(ev => ev.target.checked)
      .startWith(false)
      .do((x) => {console.log(`Checkbox value changed to ${x}`)})
      .map(view)

  return {DOM: vTree$}
}

export default HeroSimple
