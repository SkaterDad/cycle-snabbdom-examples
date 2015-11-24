# cycle-snabbdom-examples
Examples using Cycle.js with Snabbdom as the v-dom library.

## examples

1. Color Changer - Basically just a counter app, but background color changes.
2. Github Search - Clone of official Cycle example, with snabbdom-specific animations as search results are added/removed.

## Known Issues

1. Select the Github Search example and do a few searches.  Then switch to the
 Color Change example.  Then go back to Github search.  The next search you do
 will send 5+ GET requests.
