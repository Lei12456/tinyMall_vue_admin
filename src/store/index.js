import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'

/**
 * 自己的状态机js
 */
import login from './modules/login'
import product from './modules/product/product'
import brand from './modules/product/brand'
import productType from './modules/product/productType'
import user from './modules/user/user'
import order from './modules/order/order'
import cancel from './modules/order/cancelOrder'
import index from './modules/index/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    login,
    product,
    brand,
    productType,
    user,
    order,
    cancel,
    index
  },
  getters
})

export default store
