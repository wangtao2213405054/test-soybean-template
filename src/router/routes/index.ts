import type { CustomRoute, ElegantConstRoute, ElegantRoute } from "@elegant-router/types"
import { generatedRoutes } from "../elegant/routes"
import { layouts, views } from "../elegant/imports"
import { transformElegantRoutesToVueRoutes } from "../elegant/transform"

/**
 * 自定义路由配置
 *
 * @link https://github.com/soybeanjs/elegant-router?tab=readme-ov-file#custom-route
 */
const customRoutes: CustomRoute[] = []

/**
 * 创建静态路由
 *
 * - 根据路由的 `meta.constant` 属性，将路由分为常量路由和需要授权的路由。
 * - 常量路由在初始化时加载，而需要授权的路由在用户登录后加载。
 */
export function createStaticRoutes() {
  const constantRoutes: ElegantRoute[] = [] // 存储常量路由
  const authRoutes: ElegantRoute[] = [] // 存储需要授权的路由

  // 将自定义路由和生成的路由合并，并根据 `meta.constant` 属性进行分类
  ;[...customRoutes, ...generatedRoutes].forEach((item) => {
    if (item.meta?.constant) {
      constantRoutes.push(item)
    } else {
      authRoutes.push(item)
    }
  })

  return {
    constantRoutes,
    authRoutes
  }
}

/**
 * 获取授权路由的 Vue 路由配置
 *
 * - 将优雅路由转换为 Vue Router 识别的路由配置。
 *
 * @param routes - 优雅路由
 */
export function getAuthVueRoutes(routes: ElegantConstRoute[]) {
  return transformElegantRoutesToVueRoutes(routes, layouts, views)
}
