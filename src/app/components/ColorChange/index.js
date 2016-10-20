import xs from 'xstream'
import {h} from '@cycle/dom'
import {fadeInOutStyle} from '../../global/styles'
import './styles.scss'

let colors = [
  {bg: 'White', font: 'Black'},
  {bg: 'Gray', font: 'White'},
  {bg: 'Green', font: 'Yellow'},
  {bg: 'Red', font: 'Black'},
  {bg: 'Black', font: 'White'},
]

const increment = 1

function nextColorIndex(curr, inc) {
  let newColor = curr + inc
  if (newColor < 0) {
    return colors.length - 1
  }
  if (newColor > colors.length - 1) {
    return 0
  }
  return newColor
}

const view = (color) => {
  const nextBg = nextColorIndex(color, increment)
  const prevBg = nextColorIndex(color, -increment)
  return h('div.page-wrapper',{key: `colorpage`, style: fadeInOutStyle},[
    h('div.page',{},[
      h('div.color-change-container.flexcenter', {style: {backgroundColor: colors[color].bg}}, [
        h('h3',{style: {color: colors[color].font}},'Magic Color Changer'),
        h('em',{style: {color: colors[color].font}},'Cycle (get it?) through 5 colors.'),
        h('button.colorBtn.next', {}, `Go to ${colors[nextBg].bg}`),
        h('button.colorBtn.prev', {}, `Back to ${colors[prevBg].bg}`),
      ]),
    ]),
  ])
}

const ColorChange = ({DOM}) => {
  let action$ = xs.merge(
    DOM.select('button.colorBtn.next').events('click').mapTo(increment),
    DOM.select('button.colorBtn.prev').events('click').mapTo(-increment)
  )
    .debug((x) => console.log(`Color change action emitted: ${x}`))

  let color$ = action$.fold(nextColorIndex, 0)
    .debug((x) => console.log(`Colors index emitted: ${x}`))

  let vTree$ = color$
    .map(view)
    .debug(() => console.log(`Colors DOM emitted`))

  return {DOM: vTree$}
}

export default ColorChange
