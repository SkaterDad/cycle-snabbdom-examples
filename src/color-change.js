import {h} from 'cycle-snabbdom'
import Rx from 'rx'

const colors = [
  {bg: 'white', font: 'black'},
  {bg: 'gray', font: 'white'},
  {bg: 'green', font: 'yellow'},
  {bg: 'red', font: 'black'},
  {bg: 'black', font: 'white'},
]

function home({DOM}) {
  let action$ = Rx.Observable.merge(
    DOM.select('button.colorBtn.next').events('click').map(1),
    DOM.select('button.colorBtn.prev').events('click').map(-1)
  )

  let color$ = action$.startWith(0).scan((acc,seed) => {
    let newColor = acc + seed
    if (newColor < 0) {
      return colors.length - 1
    }
    if (newColor > colors.length - 1) {
      return 0
    }
    return newColor
  })

  let vTree$ = color$
      .map((color) =>
        h('div.anim-bg-color.flexcenter', {style: {backgroundColor: colors[color].bg}}, [
          h('h3',{style: {color: colors[color].font}},'Magic Color Changer'),
          h('button.colorBtn.next', {}, 'Click here for a good time!'),
          h('button.colorBtn.prev', {}, 'Click here for a worse time!'),
        ])
      )

  return {DOM: vTree$}
}

export default home
