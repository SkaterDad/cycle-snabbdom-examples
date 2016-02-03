import {h} from 'cycle-snabbdom'
import fadeInOutStyle from './styles.js'
import './loading.scss'

function loadingSpinner() {
  return h('div.spinner-container', {style: fadeInOutStyle}, [
    h('div.spinner', [
      h('div.rect1'),
      h('div.rect2'),
      h('div.rect3'),
      h('div.rect4'),
      h('div.rect5'),
    ]),
  ])
}

export default loadingSpinner
