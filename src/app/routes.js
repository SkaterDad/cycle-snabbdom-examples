import {h} from 'cycle-snabbdom'
import isolate from '@cycle/isolate'
import Colors from './components/ColorChange'
import Github from './components/GithubSearch'
import HeroComplexList from './components/HeroComplex/List'
import HeroComplexDetail from './components/HeroComplex/Detail'
import HeroSimple from './components/HeroSimple'
import HeroTests from './components/HeroTests'

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
