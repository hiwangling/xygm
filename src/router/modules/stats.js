/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const statsRouter = {
  path: '/stats',
  component: Layout,
  alwaysShow: true,
  name: 'vueStats',
  meta: { title: '统计管理', icon: 'nested' },
  children: [
    {
      path: 'cemetery-list',
      name: 'VueCemeteryList',
      component: () => import('@/views/stats/cemetery-list'),
      meta: {
        title: '购墓统计',
        noCache: true,
        perms: ['GET /api/v1/service_info/service_infos_by_cemetery']
      }
    },
    {
      path: 'service-list',
      name: 'VueServiceList',
      component: () => import('@/views/stats/service-list'),
      meta: {
        title: '服务统计',
        noCache: true,
        perms: ['GET /api/v1/service_info/service_infos_by_cemetery']
      }
    },
    {
      path: 'lamp-list',
      name: 'VueLampList',
      component: () => import('@/views/stats/lamp-list'),
      meta: {
        title: '点灯统计',
        noCache: true,
        perms: ['GET /api/v1/service_info/service_infos_by_cemetery']
      }
    },
    {
      path: 'bury-list',
      name: 'VueBuryList',
      component: () => import('@/views/stats/bury-list'),
      meta: {
        title: '安葬统计',
        noCache: true,
        perms: ['GET /api/v1/service_info/service_infos_by_cemetery']
      }
    },
    {
      path: 'data-list',
      name: 'VueDataList',
      component: () => import('@/views/stats/data-list'),
      meta: {
        title: '数据统计',
        noCache: true,
        perms: ['GET /api/v1/service_info/service_infos_by_cemetery']
      }
    },
    {
      path: 'old-list',
      name: 'VueOldList',
      component: () => import('@/views/stats/old-list'),
      meta: {
        title: '老数据导入',
        noCache: true,
        perms: ['GET /api/v1/service_info/service_infos_by_cemetery']
      }
    }
  ]
}
export default statsRouter
