import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { nanoid } from 'nanoid'
import _ from 'lodash-es'

import { useGoodStore } from '@/store/good'
import { useAdminStore } from '@/store/admin'

let routerList = []

const router: any = createRouter({
  extendRoutes: (routes) => {
    let admminList = []
    let publicList = []
    routes.forEach((v) => {
      if (['/login'].indexOf(v.path) !== -1) {
        publicList.push({
          ...v,
          meta: {
            hash: nanoid(),
            requiresAuth: false,
          },
        })
      } else {
        admminList.push({
          ...v,
          meta: {
            hash: nanoid(),
            requiresAuth: true,
          },
        })
      }
    })

    const path404 = [
      {
        path: '/:catchAll(.*)',
        name: '404',
        component: () => import('@/pages/404/index.vue'),
        meta: {
          requiresAuth: false,
        },
      },
    ]

    routerList = [...setupLayouts(admminList), ...publicList, ...path404]
    return routerList
  },
  history: createWebHistory(),
})

router.beforeEach((to, from, next) => {
  const goodStore = useGoodStore()
  const adminStore = useAdminStore()
  goodStore.routers = onListTrim(routerList)

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isAuthenticated = adminStore.token
  // console.log({ isAuthenticated, to, from })
  if (isAuthenticated && to.path === '/login') {
    next('/')
  } else if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

const onListTrim = (list) => {
  const nameList = [
    {
      key: '/',
      value: '首页',
      icon: 'home',
    },
    {
      key: '//',
      value: '首页',
      icon: 'home',
    },
    {
      key: '/home',
      value: '项目',
      icon: 'renwu',
    },
    {
      key: '/home/',
      value: '预约面板',
      icon: 'renwu',
    },
    {
      key: '/me',
      value: '人员中心',
      icon: 'admin',
    },
    {
      key: '/me/',
      value: '成员管理',
      icon: 'doctor',
    },
    {
      key: '/me/good',
      value: '客户管理',
      icon: 'patient',
    },
  ]

  const listA = []
  list.forEach((u) => {
    if (u.meta.requiresAuth) {
      const soleA = _.find(nameList, { key: u.path })
      const listB = []
      u.children[0].children.forEach((h) => {
        const soleB = _.find(nameList, { key: h.name })
        listB.push({
          ...h,
          key: h.name,
          keyParent: h.path,
          icon: soleB.icon,
          title: soleB.value,
        })
      })
      listA.push({
        ...u,
        children: listB,
        key: u.path,
        icon: soleA.icon,
        title: soleA.value,
      })
    }
  })
  console.log({ listA })

  return listA
}

export default router
