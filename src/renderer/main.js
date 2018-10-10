import Vue from 'vue'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'ionicons/css/ionicons.min.css'
import 'animate.css/animate.min.css'
import App from './App'
import router from './router'
import store from './store'
import http from './http/http'
import './style/common.css'
import './style/animation.css'
import splashScreen from './page/splashScreen';
import directive from 'element-ui/packages/popover/src/directive';
import _ from 'lodash'
import util from './util/index'
import indicator from './components/player/indicator'
import options from './components/global/options'
import search from './components/search/index'
import $mixins from  './mixin/index'
Vue.directive('popover', directive);
// import axios from 'axios'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
window.$http = http;
window.$util = util;
window.$mixins = $mixins;
window._ = _;
Vue.http = Vue.prototype.$http = http
Vue.config.productionTip = false
Vue.component('splash-screen',splashScreen);
Vue.component('indicator',indicator)
Vue.component('options',options)
Vue.component('search',search)

Vue.use(elementUI)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
