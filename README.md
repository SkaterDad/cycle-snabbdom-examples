# cycle-snabbdom-examples
Examples using [Cycle.js](https://github.com/cyclejs) with [Snabbdom](https://github.com/paldepind/snabbdom) as the v-dom library (by way of the [cycle-snabbdom](https://github.com/TylorS/cycle-snabbdom) driver).

## examples

1. Color Changer - Basically just a counter app, but background color changes by looping through an array.
2. Github Search - Clone of official Cycle example, with snabbdom-specific animations as search results are added/removed.
3. Hero Transition (Simple) - Checkbox toggles between pages.  Each page is a box with some text.  The text does a hero transition.
4. Hero Transition (Complex) - 1st page pulls repo list from github.  2nd page is detail for a specific repo.  The owner avatar does a hero transition.

## snabbdom specific animations

* Route/Page transitions - currently just opacity fade, but you can easily extend to add transforms.
* Search result items animate when added & removed.
* Hero transitions (aka. shared element transitions).  An item which is common to two pages will smoothly animate to the new position.  My examples are relying on a modified version of the official snabbdom hero module.

## Future plans

* Document how some of these examples work in more detail.  There is a careful balance of `position: relative` and `position: absolute` on certain elements and containers.
* Continue modifying the snabbdom hero module to make it more bulletproof and flexible.  As of now, I recommend against doing hero transitions if the node has children.