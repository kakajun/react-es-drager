import { createHashRouter, createBrowserRouter, Navigate } from 'react-router-dom'
import HomeLayout from './views/Home'
import React from 'react'
import Basic from './examples/Basic'
import Event from './examples/Event'
import Group from './examples/Group'
import Grid from './examples/Grid'
import InfoEx from './examples/InfoEx'
import MarklineEx from './examples/MarklineEx'
import SlotEx from './examples/SlotEx'
import Chart from './examples/Chart'

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
  },
  {
    path: 'grid',
    element: <Grid></Grid>,
    meta: {
      title: 'grid'
    }
  },
  {
    path: 'InfoEx',
    element: <InfoEx></InfoEx>,
    meta: {
      title: 'info'
    }
  },
  {
    path: 'SlotEx',
    element: <SlotEx></SlotEx>,
    meta: {
      title: 'slot'
    }
  },
  {
    path: 'chart',
    element: <Chart></Chart>,
    meta: {
      title: 'chart'
    }
  },
  {
    path: 'MarklineEx',
    element: <MarklineEx></MarklineEx>,
    meta: {
      title: 'markline'
    }
  },
  {
    path: 'group',
    element: <Group></Group>,
    meta: {
      title: 'group'
    }
  }
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
      // {
      //   path: '/',
      //   element: <Navigate to="/basic" replace />
      // },
      ...menuRoutes
    ]
  }
])
