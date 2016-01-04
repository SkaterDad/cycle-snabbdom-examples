import {h} from 'cycle-snabbdom'
import isolate from '@cycle/isolate'
import Colors from './examples/ColorChange'
import Github from './examples/GithubSearch'
import HeroComplex from './examples/HeroComplex'
import HeroSimple from './examples/HeroSimple'
import HeroTests from './examples/HeroTests'

const routes = {
  '/': Colors,
  '/github': isolate(Github),
  '/hero-complex': HeroComplex,
  '/hero-simple': HeroSimple,
  '/hero-tests': HeroTests,
  '/just-dom': h('h1', {}, 'This route only returns a <h1>.'),
  '*': Colors,
}

export default routes
