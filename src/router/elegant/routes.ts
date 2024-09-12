/* eslint-disable */
/* prettier-ignore */

/**
 * 文件: generated-routes.ts
 * 描述: 该文件由 elegant-router 生成，包含应用中各个路由的定义。
 * 详细信息请参见: https://github.com/soybeanjs/elegant-router
 */

import type { GeneratedRoute } from '@elegant-router/types';

/**
 * 定义应用的动态生成路由列表。
 * 每个路由对象包含路径、组件和元数据等信息。
 */
export const generatedRoutes: GeneratedRoute[] = [
  {
    name: '403',
    path: '/403',
    component: 'layout.blank$view.403',
    meta: {
      title: '403',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: '404',
    path: '/404',
    component: 'layout.blank$view.404',
    meta: {
      title: '404',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: '500',
    path: '/500',
    component: 'layout.blank$view.500',
    meta: {
      title: '500',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: 'home',
    path: '/home',
    component: 'layout.base$view.home',
    meta: {
      title: 'home',
      icon: 'mdi:monitor-dashboard',
      order: 1
    }
  },
  {
    name: 'iframe-page',
    path: '/iframe-page/:url',
    component: 'layout.base$view.iframe-page',
    props: true,
    meta: {
      title: 'iframe-page',
      constant: true,
      hideInMenu: true,
      keepAlive: true
    }
  },
  {
    name: 'login',
    path: '/login/:module(pwd-login|code-login|register|reset-pwd|bind-wechat)?',
    component: 'layout.blank$view.login',
    props: true,
    meta: {
      title: 'login',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: 'manage',
    path: '/manage',
    component: 'layout.home',
    meta: {
      title: '系统管理',
      homepage: true
    },
    children: [
      {
        name: 'manage_menu',
        path: '/manage/menu',
        component: 'view.manage_menu',
        meta: {
          title: '菜单管理',
          homepage: true
        }
      },
      {
        name: 'manage_role',
        path: '/manage/role',
        component: 'view.manage_role',
        meta: {
          title: '角色管理',
          homepage: true
        }
      }
    ]
  },
  {
    name: 'project',
    path: '/project',
    component: 'layout.home$view.project',
    meta: {
      title: '项目',
      homepage: true
    }
  },
  {
    name: 'test',
    path: '/test',
    component: 'layout.base$view.test',
    meta: {
      title: '测试'
    }
  }
];
