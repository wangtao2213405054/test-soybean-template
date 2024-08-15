import { useRouter } from "vue-router"
import type { RouteLocationRaw } from "vue-router"
import type { RouteKey } from "@elegant-router/types"
import { router as globalRouter } from "@/router"

/**
 * 路由跳转
 *
 * 跳转到指定的路由，功能类似于 router.push
 *
 * @param inSetup 是否在 Vue script setup 中
 */
export function useRouterPush(inSetup = true) {
  // 根据参数决定使用当前 setup 中的 router 还是全局 router
  const router = inSetup ? useRouter() : globalRouter
  const route = globalRouter.currentRoute

  const routerPush = router.push
  const routerBack = router.back

  interface RouterPushOptions {
    query?: Record<string, string>
    params?: Record<string, string>
  }

  /**
   * 通过路由键进行跳转
   *
   * @param key 路由键
   * @param options 跳转选项，包含 query 和 params
   */
  async function routerPushByKey(key: RouteKey, options?: RouterPushOptions) {
    const { query, params } = options || {}

    const routeLocation: RouteLocationRaw = {
      name: key
    }

    if (Object.keys(query || {}).length) {
      routeLocation.query = query
    }

    if (Object.keys(params || {}).length) {
      routeLocation.params = params
    }

    return routerPush(routeLocation)
  }

  /**
   * 通过路由键和 meta 信息中的 query 进行跳转
   *
   * @param key 路由键
   */
  function routerPushByKeyWithMetaQuery(key: RouteKey) {
    const allRoutes = router.getRoutes()
    const meta = allRoutes.find((item) => item.name === key)?.meta || null

    const query: Record<string, string> = {}

    meta?.query?.forEach((item) => {
      query[item.key] = item.value
    })

    return routerPushByKey(key, { query })
  }

  /** 跳转到主页 */
  async function toHome() {
    return routerPushByKey("root")
  }

  /**
   * 跳转到登录页面
   *
   * @param loginModule 登录模块
   * @param redirectUrl 跳转后的 URL，若未指定，则使用当前路由的 fullPath
   */
  async function toLogin(loginModule?: UnionKey.LoginModule, redirectUrl?: string) {
    const module = loginModule || "pwd-login"

    const options: RouterPushOptions = {
      params: {
        module
      }
    }

    const redirect = redirectUrl || route.value.fullPath

    options.query = {
      redirect
    }

    return routerPushByKey("login", options)
  }

  /**
   * 切换登录模块
   *
   * @param module 登录模块
   */
  async function toggleLoginModule(module: UnionKey.LoginModule) {
    const query = route.value.query as Record<string, string>

    return routerPushByKey("login", { query, params: { module } })
  }

  /** 从登录页面重定向 */
  async function redirectFromLogin() {
    const redirect = route.value.query?.redirect as string

    if (redirect) {
      routerPush(redirect)
    } else {
      toHome()
    }
  }

  return {
    routerPush,
    routerBack,
    routerPushByKey,
    routerPushByKeyWithMetaQuery,
    toLogin,
    toggleLoginModule,
    redirectFromLogin
  }
}
