# DISCLAIMER
This branch aims to update these examples to the latest & greatest version of Cycle.js w/ x-stream.

# cycle-snabbdom-examples
Examples using [Cycle.js](https://github.com/cyclejs) with [Snabbdom](https://github.com/paldepind/snabbdom) as the v-dom library (this is now default).

## To use:
1. `npm install`
2. `npm start`
3. Open Index.html in your browser

## Examples

1. Color Changer - Basically just a counter app, but background color changes by looping through an array.
2. Github Search - Clone of official Cycle example, with snabbdom-specific animations as search results are added/removed.
3. Hero Transition (Simple) - Checkbox toggles between pages.  Each page is a box with some text.  The text does a hero transition.
4. Hero Transition (Complex) - 1st page pulls repo list from github.  2nd page is detail for a specific repo.  The owner avatar does a hero transition.
5. Hero Transition (Tests) - Hero transitions on multiple types of DOM elements, including text which changes orientation and size.  Best viewed in Chrome.  Other browsers have problems with one of the text transitions.

## snabbdom-specific animations

* Route/Page transitions - currently just opacity fade, but you can easily extend to add transforms.  The important part is that your page wrappers are `position: absolute` so they can overlap while transitioning.
* Search result items animate when added & removed.
* Hero transitions (aka. shared element transitions).  An item which is common to two pages will smoothly animate to the new position.  This relies on the snabbdom hero module, so you'll need to pass a list of modules to the Cycle DOM driver.

## Future plans

* Document how some of these examples work in more detail.  There is a careful balance of `position: relative` and `position: absolute` on certain elements and containers.

## How to use
For client-side hot reloading:
 1. Clone the repo
 2. Choose a branch
 3. `npm install`
 4. `npm run hot-client`
 5. Open your browser to `http://localhost:3000/`
