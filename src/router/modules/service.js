/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const serviceRouter = {
  path: '/service',
  component: Layout,
  name: 'VueService',
  alwaysShow: true,
  meta: { title: '服务设置', icon: 'list' },
  children: [
    {
      path: 'service-info',
      name: 'VueInfo',
      component: () => import('@/views/service/service-info'),
      meta: {
        title: '服务项目',
        noCache: true,
        perms: ['GET /api/v1/service_info/list', 'POST /api/v1/service_info/add', 'POST /api/v1/service_info/edit', 'GET /api/v1/service_info/del']
      }
    },
    {
      path: 'service-combo',
      name: 'VueCombo',
      component: () => import('@/views/service/service-combo'),
      meta: {
        title: '服务套餐',
        noCache: true,
        perms: ['GET /api/v1/combo/list', 'POST /api/v1/combo/add', 'POST /api/v1/combo/edit', 'GET /api/v1/combo/del']
      }
    }
  ]
}
export default serviceRouter
