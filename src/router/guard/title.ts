import { useTitle } from "@vueuse/core"
import type { Router } from "vue-router"

/**
 * 创建文档标题守卫
 *
 * 该函数在每次路由切换后，根据路由元信息更新页面的标题。
 *
 * @param router - Vue Router 实例
 */
export function createDocumentTitleGuard(router: Router) {
  router.afterEach((to) => {
    const { title } = to.meta
    // 使用 VueUse 提供的 useTitle 函数更新文档标题
    useTitle(title)
  })
}
