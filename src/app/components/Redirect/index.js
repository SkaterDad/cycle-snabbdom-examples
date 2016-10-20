import xs from 'xstream'
import {h} from '@cycle/dom'
import {fadeInOutStyle} from '../../global/styles'
import './styles.scss'

const view = h('div.page-wrapper',{key: `redirect`, style: fadeInOutStyle},[
  h('form.redirect-container.form1', {attrs: {action: '/redirect', method: 'post'}}, [
    h('button.redir', {attrs: {type: 'submit'}}, 'Trigger Server Redirect'),
    h('p', {}, 'Redirection after a <form> submission can be handled multiple ways.'),
    h('p', {}, 'In this example, I wanted to ensure that the user gets redirected even if the Javascript wasn\'t functional.' +
    '  To accomplish this, the server will respond with a 302 Redirect if the default HTML form action occurs.'),
    h('p', {}, 'If JS is working, it submits a POST request through the HTTP driver, and the primary \'src/app.js\' ' +
    'file will intercept the response and redirect to the url specified in the custom  headers.' +
    '  You could make the server detect the custom headers and respond with a more lightweight payload instead of the full HTML it currently does.'),
    h('p', {}, 'Another (probably better) method would be to subscribe to the POST response within this component ' +
    'and, on success, emit a new URL to the History sink.  On error, you could display messages in the view.'),
  ]),
])

const ColorChange = ({DOM}) => {
  //This form submission sends a POST request.  The response is handled in 'src/app.js' (serverRedirects$)
  const postForm1$ = DOM.select('.form1').events('submit')
    .debug(ev => {ev.preventDefault()})
    .mapTo({url: '/redirect', method: 'POST', eager: 'true', headers: {redirect: true, redirectUrl: '/hero-simple'}})
    .debug(console.log(`Form1 post via javascript.`))

  let vTree$ = xs.of(view)

  return {
    DOM: vTree$,
    HTTP: postForm1$,
  }
}

export default ColorChange
