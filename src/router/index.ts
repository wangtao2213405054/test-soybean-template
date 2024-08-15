import type { App } from "vue"
import {
  type RouterHistory,
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from "vue-router"
import { createBuiltinVueRoutes } from "./routes/builtin"
import { createRouterGuard } from "./guard"

// 从环境变量中获取路由历史模式和基础 URL
const { VITE_ROUTER_HISTORY_MODE = "history", VITE_BASE_URL } = import.meta.env

/**
 * 路由历史模式创建器映射
 *
 * - 根据不同的历史模式（hash、history、memory），返回对应的历史模式创建函数。
 */
const historyCreatorMap: Record<Env.RouterHistoryMode, (base?: string) => RouterHistory> = {
  hash: createWebHashHistory, // 哈希模式，URL 中会包含 # 符号
  history: createWebHistory, // HTML5 历史模式，不会在 URL 中包含 # 符号
  memory: createMemoryHistory // 内存模式，用于测试，URL 不会改变
}

/**
 * 创建 Vue Router 实例
 *
 * - 根据环境变量选择的历史模式和基础 URL 配置 Vue Router。
 * - 使用内置路由配置创建路由实例。
 */
export const router = createRouter({
  history: historyCreatorMap[VITE_ROUTER_HISTORY_MODE](VITE_BASE_URL),
  routes: createBuiltinVueRoutes()
})

/**
 * 设置 Vue Router
 *
 * - 将创建的路由实例注册到 Vue 应用中。
 * - 配置路由守卫。
 * - 等待路由准备完毕。
 *
 * @param app - Vue 应用实例
 */
export async function setupRouter(app: App) {
  app.use(router)
  createRouterGuard(router)
  await router.isReady()
}
