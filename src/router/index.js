import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
      meta: { title: 'Index', icon: 'index' }
    }]
  },
  {
    path: '/product-manage',
    component: Layout,
    redirect: '/product-manage/product-list',
    name: 'Product-manage',
    meta: { title: 'Product Manager', icon: 'product-manage' },
    children: [
      {
        path: 'product-list',
        name: 'Product-list',
        component: () => import('@/views/productManage/productList'),
        meta: { title: 'Product List', icon: 'product-list' }
      },
      {
        path: 'product-add',
        name: 'Product-add',
        component: () => import('@/views/productManage/productAdd'),
        meta: { title: 'Product Add', icon: 'add' }
      },
      {
        path: 'brand-list',
        name: 'Brand-list', 
        component: () => import('@/views/productManage/brandList'),
        meta: { title: 'Brand List', icon: 'brand-list' }
      },
      {
        path: 'product-type-list',
        name: 'Product-type-list',
        component: () => import('@/views/productManage/productTypeList'),
        meta: { title: 'Product Type List', icon: 'product-type-list' }
      }
    ]
  },
  {
    path:'/order-manage',
    component: Layout,
    redirect: '/order-manage/order-list',
    name: 'Order-manage',
    meta: { title: 'Order Manager', icon: 'product-manage' },
    children: [
      {
        path: 'order-list',
        name: 'Order-list',
        component: () => import('@/views/orderManage/orderList'),
        meta: { title: 'Order List', icon: 'product-list' },
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
        meta: { title: 'Order Detail', icon: 'product-list' },
        hidden: true
      },
      {
        path: 'cancel-detail',
        name: 'cancel-detail',
        component: () => import('@/views/orderManage/cancelDetail'),
        meta: { title: 'Cancel Detail', icon: 'product-list' },
        hidden: true
      },
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
