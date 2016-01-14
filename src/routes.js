import {h} from 'cycle-snabbdom'
import isolate from '@cycle/isolate'
import Colors from './examples/ColorChange'
import Github from './examples/GithubSearch'
import HeroComplexList from './examples/HeroComplex/List'
import HeroComplexDetail from './examples/HeroComplex/Detail'
import HeroSimple from './examples/HeroSimple'
import HeroTests from './examples/HeroTests'

const routes = {
  '/': Colors,
  '/github': isolate(Github),
  '/hero-simple': HeroSimple,
  '/hero-tests': HeroTests,
  '/just-dom': h('h1', {}, 'This route only returns a <h1>.'),
  '/hero-complex/:owner/:repo': HeroComplexDetail,
  '/hero-complex': HeroComplexList,
  '*': Colors,
}

export default routes
