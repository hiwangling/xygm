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
      path: '/reserve-list',
      name: 'VueReserveList',
      component: () => import('@/views/order/reserve-list'),
      meta: {
        title: '预定管理',
        noCache: true,
        perms: ['GET /api/v1/reserve/all_list']
      }
    },
    {
      path: '/save-list',
      name: 'VueSaveList',
      component: () => import('@/views/order/save-list'),
      meta: {
        title: '寄存管理',
        noCache: true,
        perms: ['GET /api/v1/save/list', 'POST /api/v1/save/add', 'POST /api/v1/save/edit', 'GET /api/v1/save/del,POST /api/v1/save/jiesuan']
      }
    },
    {
      path: '/service-handle',
      name: 'VueServiceHandle',
      component: () => import('@/views/order/service-handle'),
      meta: {
        title: '服务处理',
        noCache: true,
        perms: ['GET /api/v1/service_info/service_infos_by_cemetery', 'POST /api/v1/servicebill/execute']
      }
    }
  ]
}
export default orderRouter
