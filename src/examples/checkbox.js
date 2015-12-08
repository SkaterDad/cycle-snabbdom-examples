import {h} from 'cycle-snabbdom'

function checkbox({DOM}) {
  let requests = {
    DOM: DOM.select('input').events('change')
      .map(ev => ev.target.checked)
      .startWith(false)
      .do((x) => { console.log(`Checkbox value changed to ${x}`)}) //eslint-disable-line
      .map(toggled =>
        h('div', [
          h('input#box1', {props: {type: 'checkbox'}}), 'Toggle me',
          h('p', toggled ? 'On' : 'Off')
        ])
      )
  }
  return requests
}

export default checkbox
