import Vue from 'vue'
import Router from 'vue-router'
import common from './common'
Vue.use(Router)

const routes = [
	...common
]

const router = new Router({
	routes,
	mode: 'hash',
	linkActiveClass: 'active'
})
/*router.beforeEach((to,form,next) => {
  console.log(to,form,'1');
  next();
})*/
export default router;