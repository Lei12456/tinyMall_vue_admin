import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import login from '@/store/modules/login.js'
import {mapState} from 'vuex'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'index'}
    }]
  },
  // 404 page must be placed at the end !!!
  //{ path: '*', redirect: '/404', hidden: true }
]

let userRt =  {
    path: '/userList',
    component: Layout,
    children: [{
      path: 'userList',
      name: 'userList',
      component: () => import('@/views/userManage/userList'),
      meta: { title: '用户管理', icon: 'user'}
    }]
}
let productRt = {
  path: '/product-manage',
  component: Layout,
  redirect: '/product-manage/product-list',
  name: 'Product-manage',
  meta: { title: '商品管理', icon: 'product'},
  children: [
    {
      path: 'product-list',
      name: 'Product-list',
      component: () => import('@/views/productManage/productList'),
      meta: { title: '商品列表', icon: 'product-list' }
    },
    {
      path: 'product-add',
      name: 'Product-add',
      component: () => import('@/views/productManage/productAdd'),
      meta: { title: '添加商品', icon: 'add' }
    },
    {
      path: 'brand-list',
      name: 'Brand-list', 
      component: () => import('@/views/productManage/brandList'),
      meta: { title: '品牌列表', icon: 'brand-list' }
    },
    {
      path: 'product-type-list',
      name: 'Product-type-list',
      component: () => import('@/views/productManage/productTypeList'),
      meta: { title: '商品类型', icon: 'product-type-list' }
    }
  ]
}
let orderRt = {
  path:'/order-manage',
  component: Layout,
  redirect: '/order-manage/order-list',
  name: 'Order-manage',
  meta: { title: '订单管理', icon: 'order' },
  children: [
    {
      path: 'order-list',
      name: 'Order-list',
      component: () => import('@/views/orderManage/orderList'),
      meta: { title: '订单列表', icon: 'product-list' },
    },
    {
      path: 'cancelOrder-list',
      name: 'cancelOrder-list',
      component: () => import('@/views/orderManage/cancelOrderList'),
      meta: { title: '退货处理', icon: 'product-list' },
    },
    {
      path: 'order-detail',
      name: 'Order-detail',
      component: () => import('@/views/orderManage/orderDetail'),
      meta: { title: '订单详情', icon: 'product-list' },
      hidden: true
    },
    {
      path: 'cancel-detail',
      name: 'cancel-detail',
      component: () => import('@/views/orderManage/cancelDetail'),
      meta: { title: '退货详情', icon: 'product-list' },
      hidden: true
    },
  ]
}
let userInfo =  JSON.parse(localStorage.getItem('userInfo'));
//let state = login.state;
//let state = this.$store.state.login.userInfo;
//console.log(getter);
if(userInfo != null && userInfo != ''){
  let role = userInfo.role;
  if(role != null){
    if(role.id === 1){
      constantRoutes.push(userRt);
      constantRoutes.push(orderRt);
      constantRoutes.push(productRt);
    }else if(role.id === 2){
      constantRoutes.push(orderRt);
    }else if(role.id === 3){
      constantRoutes.push(productRt);
    }
  }
}


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 1 }),
  routes: constantRoutes
})
const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router 




