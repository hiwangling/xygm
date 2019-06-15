/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  alwaysShow: true,
  name: 'vueOrder',
  meta: { title: '订单管理', icon: 'shopping' },
  children: [
    {
      path: 'reserve-list',
      name: 'VueReserveList',
      component: () => import('@/views/order/reserve-list'),
      meta: {
        title: '预定管理',
        noCache: true,
        perms: ['GET /api/v1/reserve/list']
      }
    }, {
      path: 'save-list',
      name: 'VueSaveList',
      component: () => import('@/views/order/save-list'),
      meta: {
        title: '寄存管理',
        noCache: true,
        perms: ['GET /api/v1/save/list']
      }
    },
    {
      path: 'service-list',
      name: 'VueServiceList',
      component: () => import('@/views/order/service-list'),
      meta: {
        title: '服务管理',
        noCache: true,
        perms: ['GET /api/v1/service_info/service_infos_by_cemetery']
      }
    },
    {
      path: 'cemetery-list',
      name: 'VueCemeteryList',
      component: () => import('@/views/order/cemetery-list'),
      meta: {
        title: '公墓管理',
        noCache: true,
        perms: ['GET /api/v1/service_info/service_infos_by_cemetery']
      }
    }
  ]
}
export default orderRouter