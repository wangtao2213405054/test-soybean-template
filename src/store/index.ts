import type { App } from "vue"
import { createPinia } from "pinia"
import { resetSetupStore } from "./plugins"

/**
 * 设置 Vue store 插件 pinia
 *
 * @param app Vue 应用实例
 */
export function setupStore(app: App) {
  // 创建 Pinia 实例
  const store = createPinia()

  // 注册插件，用于重置通过 setup 语法编写的 store 的状态
  store.use(resetSetupStore)

  // 将 Pinia 插件添加到 Vue 应用
  app.use(store)
}
