import type { CustomRoute } from "@elegant-router/types"
import { layouts, views } from "../elegant/imports"
import { getRoutePath, transformElegantRoutesToVueRoutes } from "../elegant/transform"

/**
 * 根路由配置
 *
 * - 定义了根路径 `/` 并重定向到配置中的默认主页路由。
 * - 该路由为常量路由，不会被动态修改。
 */
export const ROOT_ROUTE: CustomRoute = {
  name: "root",
  path: "/",
  redirect: getRoutePath(import.meta.env.VITE_ROUTE_HOME) || "/home",
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
const NOT_FOUND_ROUTE: CustomRoute = {
  name: "not-found",
  path: "/:pathMatch(.*)*",
  component: "layout.blank$view.404",
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
const builtinRoutes: CustomRoute[] = [ROOT_ROUTE, NOT_FOUND_ROUTE]

/**
 * 创建内置的 Vue 路由
 *
 * - 将内置路由列表转换为 Vue Router 可识别的路由配置。
 * - 使用布局和视图组件来构建最终的路由结构。
 */
export function createBuiltinVueRoutes() {
  return transformElegantRoutesToVueRoutes(builtinRoutes, layouts, views)
}
