import { useTitle } from "@vueuse/core"
import type { Router } from "vue-router"
import { $t } from "@/locales"

/**
 * 创建文档标题守卫
 *
 * 该函数在每次路由切换后，根据路由元信息更新页面的标题。
 *
 * @param router - Vue Router 实例
 */
export function createDocumentTitleGuard(router: Router) {
  router.afterEach((to) => {
    const { i18nKey, title } = to.meta

    /**
     * 根据 i18nKey 或 title 设置文档标题
     *
     * - 如果 i18nKey 存在，则使用国际化的标题
     * - 否则使用静态标题
     */
    const documentTitle = i18nKey ? $t(i18nKey) : title

    // 使用 VueUse 提供的 useTitle 函数更新文档标题
    useTitle(documentTitle)
  })
}
