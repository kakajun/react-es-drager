import { createHashRouter, createBrowserRouter, Navigate } from 'react-router-dom'
import HomeLayout from './views/Home'
import React from 'react'
import Basic from './examples/Basic'
import Event from './examples/Event'
import Group from './examples/Group'
import Grid from './examples/Grid'
import Info from './examples/Info'
import Markline from './examples/Markline'
import Slot from './examples/Slot'
import Chart from './examples/Chart'
// import Menu from './examples/Menu'

export const menuRoutes = [
  {
    path: '/basic',
    element: <Basic></Basic>,
    meta: {
      title: 'basic'
    }
  },
  {
    path: '/event',
    element: <Event></Event>,
    meta: {
      title: 'event'
    }
  },
  {
    path: '/grid',
    element: <Grid></Grid>,
    meta: {
      title: 'grid'
    }
  },
  {
    path: '/info',
    element: <Info></Info>,
    meta: {
      title: 'info'
    }
  },
  {
    path: '/slot',
    element: <Slot></Slot>,
    meta: {
      title: 'slot'
    }
  },
  {
    path: '/chart',
    element: <Chart></Chart>,
    meta: {
      title: 'chart'
    }
  },
  {
    path: '/markline',
    element: <Markline></Markline>,
    meta: {
      title: 'markline'
    }
  },
  {
    path: '/group',
    element: <Group></Group>,
    meta: {
      title: 'group'
    }
  }
  // {
  //   path: 'menu',
  //   element: <Menu></Menu>,
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
