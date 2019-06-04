/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const manageRouter = {
  path: '/manage',
  component: Layout,
  name: 'VueWork',
  alwaysShow: true,
  meta: { title: '工作中心', icon: 'tab' },
  children: [
    {
      path: 'index',
      name: 'VueList',
      component: () => import('@/views/manage/index'),
      meta: {
        title: '业务大厅',
        noCache: true,
        perms: ['GET /api/v1/cemetery_classify/a_list']
      }
    },
    {
      path: 'list/:id(\\d+)',
      component: () => import('@/views/manage/list'),
      name: 'VueLists',
      meta: {
        title: '业务办理',
        noCache: true
      },
      hidden: true
    }
  ]
}
export default manageRouter
