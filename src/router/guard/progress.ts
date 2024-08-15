import type { Router } from "vue-router"

/**
 * 创建页面加载进度条的路由守卫
 *
 * 该函数通过在路由变化前后调用 NProgress 的 start 和 done 方法， 实现页面加载进度条的显示和隐藏。
 *
 * @param router - Vue Router 实例
 */
export function createProgressGuard(router: Router) {
  /** 在路由导航开始前启动进度条 */
  router.beforeEach((_to, _from, next) => {
    window.NProgress?.start?.()
    next()
  })

  /** 在路由导航结束后完成进度条 */
  router.afterEach((_to) => {
    window.NProgress?.done?.()
  })
}
