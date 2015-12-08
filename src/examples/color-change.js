import {h} from 'cycle-snabbdom'
import Rx from 'rx'
import fadeInOutStyle from '../global-styles'

const colors = [
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

function home({DOM}) {
  let action$ = Rx.Observable.merge(
    DOM.select('button.colorBtn.next').events('click').map(increment),
    DOM.select('button.colorBtn.prev').events('click').map(-increment)
  )
    .do((x) => console.log(`Color change action emitted: ${x}`)) //eslint-disable-line

  let color$ = action$.startWith(0).scan(nextColorIndex)
    .do((x) => console.log(`Colors index emitted: ${x}`)) //eslint-disable-line

  let vTree$ = color$
      .map((color) => {
        let nextBg = nextColorIndex(color, increment)
        let prevBg = nextColorIndex(color, -increment)

        return h('div.page-wrapper',{key: `colorpage`, style: fadeInOutStyle},[
          h('div.page',{},[
            h('div.color-change-container.flexcenter', {style: {backgroundColor: colors[color].bg}}, [
              h('h3',{style: {color: colors[color].font}},'Magic Color Changer'),
              h('em',{style: {color: colors[color].font}},'Cycle (get it?) through 5 colors.'),
              h('button.colorBtn.next', {}, `Go to ${colors[nextBg].bg}`),
              h('button.colorBtn.prev', {}, `Back to ${colors[prevBg].bg}`),
            ])
          ])
        ])
      })
    .do(() => console.log(`Colors DOM emitted`)) //eslint-disable-line

  return {DOM: vTree$}
}

export default home
