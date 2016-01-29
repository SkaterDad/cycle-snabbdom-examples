'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cycleSnabbdom = require('cycle-snabbdom');

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

var _styles = require('../../global/styles');

require('./styles.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var colors = [{ bg: 'White', font: 'Black' }, { bg: 'Gray', font: 'White' }, { bg: 'Green', font: 'Yellow' }, { bg: 'Red', font: 'Black' }, { bg: 'Black', font: 'White' }];

var increment = 1;

function nextColorIndex(curr, inc) {
  var newColor = curr + inc;
  if (newColor < 0) {
    return colors.length - 1;
  }
  if (newColor > colors.length - 1) {
    return 0;
  }
  return newColor;
}

var redirectForm = (0, _cycleSnabbdom.h)('form', { attrs: { action: '/redirect', method: 'post' } }, [(0, _cycleSnabbdom.h)('button.redir', { attrs: { type: 'submit' } }, 'Trigger Server Redirect')]);

var view = function view(color) {
  var nextBg = nextColorIndex(color, increment);
  var prevBg = nextColorIndex(color, -increment);
  return (0, _cycleSnabbdom.h)('div.page-wrapper', { key: 'colorpage', style: _styles.fadeInOutStyle }, [(0, _cycleSnabbdom.h)('div.page', {}, [(0, _cycleSnabbdom.h)('div.color-change-container.flexcenter', { style: { backgroundColor: colors[color].bg } }, [(0, _cycleSnabbdom.h)('h3', { style: { color: colors[color].font } }, 'Magic Color Changer'), (0, _cycleSnabbdom.h)('em', { style: { color: colors[color].font } }, 'Cycle (get it?) through 5 colors.'), (0, _cycleSnabbdom.h)('button.colorBtn.next', {}, 'Go to ' + colors[nextBg].bg), (0, _cycleSnabbdom.h)('button.colorBtn.prev', {}, 'Back to ' + colors[prevBg].bg), redirectForm])])]);
};

var ColorChange = function ColorChange(_ref) {
  var DOM = _ref.DOM;

  var action$ = _rx2.default.Observable.merge(DOM.select('button.colorBtn.next').events('click').map(increment), DOM.select('button.colorBtn.prev').events('click').map(-increment)).do(function (x) {
    return console.log('Color change action emitted: ' + x);
  });

  var postForm$ = DOM.select('form').events('submit').do(function (ev) {
    ev.preventDefault();
  }).map({ url: '/redirect', method: 'POST', eager: 'true', headers: { redirect: true, redirectUrl: '/github' } }).do(console.log('Form post via javascript.'));

  var color$ = action$.startWith(0).scan(nextColorIndex).do(function (x) {
    return console.log('Colors index emitted: ' + x);
  });

  var vTree$ = color$.map(view).do(function () {
    return console.log('Colors DOM emitted');
  });

  return { DOM: vTree$, HTTP: postForm$ };
};

exports.default = ColorChange;
