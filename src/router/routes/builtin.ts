import type { RouteRecordRaw } from "vue-router"

const BlankLayout = () => import("@/layouts/blank-layout/index.vue")

/**
 * 根路由配置
 *
 * - 定义了根路径 `/` 并重定向到配置中的默认主页路由。
 * - 该路由为常量路由，不会被动态修改。
 */
export const ROOT_ROUTE: RouteRecordRaw = {
  name: "root",
  path: "/",
  redirect: "/home",
  meta: {
    title: "root",
    constant: true
  }
}

/**
 * 404 Not Found 路由配置
 *
 * - 定义了捕获所有未匹配路径的路由，并显示 404 页面。
 * - 该路由为常量路由，必须在 Vue Router 中配置。
 */
const NOT_FOUND_ROUTE: RouteRecordRaw = {
  name: "not-found",
  path: "/:pathMatch(.*)*",
  component: BlankLayout,
  meta: {
    title: "not-found",
    constant: true
  }
}

/**
 * 内置路由列表
 *
 * - 包含必须作为常量配置在 Vue Router 中的内置路由。
 */
export const builtinRoutes: RouteRecordRaw[] = [
  ROOT_ROUTE,
  {
    path: "/403",
    component: BlankLayout,
    meta: {
      title: "403"
    },
    children: [
      {
        name: "403",
        path: "",
        component: () => import("@/views/_builtin/403/index.vue"),
        meta: {
          title: "403",
          constant: true,
          hideInMenu: true
        }
      }
    ]
  },
  {
    path: "/404",
    component: BlankLayout,
    meta: {
      title: "404"
    },
    children: [
      {
        name: "404",
        path: "",
        component: () => import("@/views/_builtin/404/index.vue"),
        meta: {
          title: "404",
          constant: true,
          hideInMenu: true
        }
      }
    ]
  },
  {
    path: "/500",
    component: BlankLayout,
    meta: {
      title: "500"
    },
    children: [
      {
        name: "500",
        path: "",
        component: () => import("@/views/_builtin/500/index.vue"),
        meta: {
          title: "500",
          constant: true,
          hideInMenu: true
        }
      }
    ]
  },
  NOT_FOUND_ROUTE
]
