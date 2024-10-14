import { createHashRouter, createBrowserRouter, Navigate } from 'react-router-dom'
import HomeLayout from './views/Home'
import React from 'react'
import Basic from './examples/Basic'
import Event from './examples/Event'
// import Group from './examples/Group'

export const menuRoutes = [
  {
    path: '/basic',
    element: <Basic></Basic>,
    meta: {
      title: 'basic'
    }
  },
  {
    path: 'event',
    element: <Event></Event>,
    meta: {
      title: 'event'
    }
  }
  // {
  //   path: 'grid',
  //   component: () => import('@/examples/grid.vue'),
  //   meta: {
  //     title: 'grid'
  //   }
  // },
  // {
  //   path: 'info',
  //   component: () => import('@/examples/info.vue'),
  //   meta: {
  //     title: 'info'
  //   }
  // },
  // {
  //   path: 'slot',
  //   component: () => import('@/examples/slot.vue'),
  //   meta: {
  //     title: 'slot'
  //   }
  // },
  // {
  //   path: 'chart',
  //   component: () => import('@/examples/chart.vue'),
  //   meta: {
  //     title: 'chart'
  //   }
  // },
  // {
  //   path: 'markline',
  //   component: () => import('@/examples/markline.vue'),
  //   meta: {
  //     title: 'markline'
  //   }
  // },
  // {
  //   path: 'group',
  //   element: <Group></Group>,
  //   meta: {
  //     title: 'group'
  //   }
  // }
  // {
  //   path: 'menu',
  //   component: () => import('@/examples/menu.vue'),
  //   meta: {
  //     title: 'menu'
  //   }
  // },
]

export const router = createHashRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/basic" replace />
      },
      ...menuRoutes
    ]
  }
])
