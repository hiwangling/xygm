/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const cemeteryRouter = {
  path: '/cemetery',
  component: Layout,
  alwaysShow: true,
  name: 'vueCemetery',
  meta: { title: '公墓管理', icon: 'component' },
  children: [
    {
      path: 'garden',
      name: 'VueGarden',
      component: () => import('@/views/cemetery/garden'),
      meta: {
        title: '墓园管理',
        noCache: true,
        perms: ['GET /api/v1/cemetery_classify/g_list', 'POST /api/v1/cemetery_classify/g_add', 'POST /api/v1/cemetery_classify/g_edit', 'GET /api/v1/cemetery_classify/g_del']
      }
    },
    {
      path: 'area',
      name: 'VueArea',
      component: () => import('@/views/cemetery/area'),
      meta: {
        title: '墓区管理',
        noCache: true,
        perms: ['GET /api/v1/cemetery_classify/a_list', 'POST /api/v1/cemetery_classify/a_add', 'POST /api/v1/cemetery_classify/a_edit', 'GET /api/v1/cemetery_classify/a_del']
      }
    },
    {
      path: 'grave',
      name: 'VueGrave',
      component: () => import('@/views/cemetery/grave'),
      meta: {
        title: '墓穴管理',
        noCache: true,
        perms: ['GET /api/v1/cemetery/list', 'POST /api/v1/cemetery/add', 'POST /api/v1/cemetery/edit', 'GET /api/v1/cemetery/del']
      }
    },
    {
      path: 'style',
      name: 'VueStyle',
      component: () => import('@/views/cemetery/style'),
      meta: {
        title: '样式管理',
        noCache: true,
        perms: ['POST /api/v1/cemetery_style/list', 'POST /api/v1/cemetery_style/add', 'POST /api/v1/cemetery_style/edit', 'POST /api/v1/cemetery_style/del']
      }
    },
    {
      path: 'type',
      name: 'VueType',
      component: () => import('@/views/cemetery/type'),
      meta: {
        title: '类型管理',
        perms: ['POST /api/v1/cemetery_type/list', 'POST /api/v1/cemetery_type/add', 'POST /api/v1/cemetery_type/edit', 'POST /api/v1/cemetery_type/del']
      }
    }
  ]
}
export default cemeteryRouter
