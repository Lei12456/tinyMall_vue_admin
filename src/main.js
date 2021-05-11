import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/css/iconfont.css"
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import Login from './views/login/login'
//引入echart
//const echarts = require('echarts');
const echarts = require('echarts');

import '@/icons' // icon
//import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(ElementUI, { locale })


Vue.prototype.$echarts = echarts


Vue.config.productionTip = false

import {mapState,mapMutations,mapActions} from 'vuex'


new Vue({
  el: '#app',
  router,
  store,
  computed:{   
    ...mapState('login',['token'])
  },
  created(){
    this.initToken();
  }, 
  methods:{
    ...mapMutations('login',['initToken']),
  },
  //render: h => h(App)
  render:function(createElement){
    let page = Login;
    if (this.token){
      page = App
    }
    return createElement(page)
  }
})
