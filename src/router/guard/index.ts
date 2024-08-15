import type { Router } from "vue-router"
import { createRouteGuard } from "./route"
import { createProgressGuard } from "./progress"
import { createDocumentTitleGuard } from "./title"

/**
 * 创建路由守卫
 *
 * 该函数初始化了多个路由守卫，分别用于处理页面加载进度、路由权限验证和动态修改文档标题。
 *
 * @param router - Vue Router 实例
 */
export function createRouterGuard(router: Router) {
  /** 初始化页面加载进度条的路由守卫 */
  createProgressGuard(router)

  /** 初始化路由权限验证的守卫 */
  createRouteGuard(router)

  /** 初始化动态修改文档标题的守卫 */
  createDocumentTitleGuard(router)
}
