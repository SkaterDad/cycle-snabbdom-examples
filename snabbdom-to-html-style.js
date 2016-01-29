//**************************************************
// custom style.js for snabbdom-to-html
// manually copy this over the NPM download for now
//**************************************************

var forOwn = require('lodash.forown')
var escape = require('lodash.escape')
var kebabCase = require('lodash.kebabcase')
var omitBy = require('lodash.omitby')
var merge = require('lodash.merge')

// data.style

module.exports = function style (vnode) {
  if (!vnode.data.style) {
    return ''
  }
  //Style properties on vnode init
  var initial = omitBy(vnode.data.style, function(value) {
    return typeof value === 'object'
  })
  //Style properties in the 'delayed' hook
  var delayed = vnode.data.style.delayed

  //Merge the initial and delayed styles.
  var mergedStyles = merge(initial, delayed)

  //Push merged styles into a string array
  var styles = []

  forOwn(mergedStyles, function (value, key) {
    styles.push(`${kebabCase(key)}: ${escape(value)}`)
  })

  //Return HTML tag attribute string
  return styles.length ? `style="${styles.join('; ')}"` : ''
}
