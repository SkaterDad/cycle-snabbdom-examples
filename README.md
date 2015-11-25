# cycle-snabbdom-examples
Examples using [Cycle.js](https://github.com/cyclejs) with [Snabbdom](https://github.com/paldepind/snabbdom) as the v-dom library (by way of the [cycle-snabbdom](https://github.com/TylorS/cycle-snabbdom) driver).

## examples

1. Color Changer - Basically just a counter app, but background color changes by looping through an array.
2. Github Search - Clone of official Cycle example, with snabbdom-specific animations as search results are added/removed.

## snabbdom specific animations

* Route/Page transitions - currently just opacity fade, but you can easily extend to add transforms.
* Search result items animate when added & removed.


## Future plans

* Port official snabbdom hero animation example
* Document how some of these examples work in more detail.  There is a careful balance of `position: relative` and `position: absolute` on certain elements and containers.