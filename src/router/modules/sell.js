/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const sellRouter = {
  path: '/sell',
  component: Layout,
  alwaysShow: true,
  name: 'vueSell',
  meta: { title: '订单管理', icon: 'shopping' },
  children: [
    {
      path: 'reserve-list',
      name: 'VueReserveList',
      component: () => import('@/views/sell/reserve-list'),
      meta: {
        title: '预定管理',
        noCache: true,
        perms: ['GET /api/v1/reserve/list']
      }
    }, {
      path: 'save-list',
      name: 'VueSaveList',
      component: () => import('@/views/sell/save-list'),
      meta: {
        title: '寄存管理',
        noCache: true,
        perms: ['GET /api/v1/save/list']
      }
    },
    {
      path: 'service-list',
      name: 'VueServiceList',
      component: () => import('@/views/sell/service-list'),
      meta: {
        title: '服务管理',
        noCache: true,
        perms: ['GET /api/v1/service_info/service_infos_by_cemetery']
      }
    }
  ]
}
export default sellRouter
