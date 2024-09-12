import type {
  LocationQueryRaw,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationRaw,
  Router
} from "vue-router"
import type { RouteKey, RoutePath } from "@elegant-router/types"
import { getRouteName } from "@/router/elegant/transform"
import { useAuthStore } from "@/store/modules/auth"
import { useRouteStore } from "@/store/modules/route"
import { localStg } from "@/utils/storage"

/**
 * 创建路由守卫
 *
 * 该函数负责在路由导航过程中进行一系列检查和跳转，确保用户具有访问某些路由的权限。
 *
 * @param router - Vue Router 实例
 */
export function createRouteGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const location = await initRoute(to)

    if (location) {
      next(location)
      return
    }

    const authStore = useAuthStore()

    /** 根路由名称 */
    const rootRoute: RouteKey = "root"
    /** 登录路由名称 */
    const loginRoute: RouteKey = "login"
    /** 无权限路由名称 */
    const noAuthorizationRoute: RouteKey = "403"

    /** 是否已登录 */
    const isLogin = Boolean(localStg.get("token"))
    /** 是否需要登录才能访问 */
    const needLogin = !to.meta.constant
    /** 路由所需的角色 */
    const routeRoles = to.meta.roles || []

    /** 用户是否具有访问该路由的角色 */
    const hasRole = authStore.userInfo.roles.some((role: string) => routeRoles.includes(role))

    /** 用户是否有访问权限 */
    const hasAuth = authStore.isStaticSuper || !routeRoles.length || hasRole

    /** 路由切换的条件与回调数组 */
    const routeSwitches: CommonType.StrategicPattern[] = [
      /** 如果已登录并且当前是登录路由，则跳转到根页面 */
      {
        condition: isLogin && to.name === loginRoute,
        callback: () => {
          next({ name: rootRoute })
        }
      },
      /** 如果是常量路由，则允许直接访问 */
      {
        condition: !needLogin,
        callback: () => {
          handleRouteSwitch(to, from, next)
        }
      },
      /** 如果路由需要登录，但用户未登录，则跳转到登录页面 */
      {
        condition: !isLogin && needLogin,
        callback: () => {
          next({ name: loginRoute, query: { redirect: to.fullPath } })
        }
      },
      /** 如果用户已登录并且有权限，则允许访问 */
      {
        condition: isLogin && needLogin && hasAuth,
        callback: () => {
          handleRouteSwitch(to, from, next)
        }
      },
      /** 如果用户已登录但没有权限，则跳转到403页面 */
      {
        condition: isLogin && needLogin && !hasAuth,
        callback: () => {
          next({ name: noAuthorizationRoute })
        }
      }
    ]

    /** 依次执行路由切换条件 */
    routeSwitches.some(({ condition, callback }) => {
      if (condition) {
        callback()
      }

      return condition
    })
  })
}

/**
 * 初始化路由
 *
 * 该函数在路由导航前初始化必要的路由信息和权限，并根据情况返回重定向位置。
 *
 * @param to - 目标路由
 * @returns 重定向位置或 null
 */
async function initRoute(to: RouteLocationNormalized): Promise<RouteLocationRaw | null> {
  const authStore = useAuthStore()
  const routeStore = useRouteStore()

  /** "not-found" 路由名称 */
  const notFoundRoute: RouteKey = "not-found"
  const isNotFoundRoute = to.name === notFoundRoute

  // 如果常量路由未初始化，则初始化常量路由
  if (!routeStore.isInitConstantRoute) {
    await routeStore.initConstantRoute()

    // 如果因为常量路由未初始化而被捕获到 "not-found" 路由，则在初始化后重定向回原始路由
    if (isNotFoundRoute) {
      const path = to.fullPath

      return {
        path,
        replace: true,
        query: to.query,
        hash: to.hash
      }
    }
  }

  // 如果目标路由是常量路由且不是 "not-found"，则允许访问
  if (to.meta.constant && !isNotFoundRoute) {
    return null
  }

  // 如果已初始化授权路由且目标路由不是 "not-found"，则允许访问
  if (routeStore.isInitAuthRoute && !isNotFoundRoute) {
    return null
  }

  // 如果被捕获到 "not-found" 路由，则检查该路由是否存在
  if (routeStore.isInitAuthRoute && isNotFoundRoute) {
    const exist = await routeStore.getIsAuthRouteExist(to.path as RoutePath)
    /** 无权限路由名称 */
    const noPermissionRoute: RouteKey = "403"

    if (exist) {
      return {
        name: noPermissionRoute
      }
    }

    return null
  }

  // 如果授权路由未初始化，则初始化授权路由
  const isLogin = Boolean(localStg.get("token"))
  // 初始化授权路由需要用户登录，未登录则跳转到登录页面
  if (!isLogin) {
    const loginRoute: RouteKey = "login"
    const query = getRouteQueryOfLoginRoute(to, routeStore.routeHome)

    return {
      name: loginRoute,
      query
    }
  }

  await authStore.initUserInfo()

  // 初始化授权路由
  await routeStore.initAuthRoute()

  // 如果因为授权路由未初始化而被捕获到 "not-found" 路由，则在初始化后重定向回原始路由
  if (isNotFoundRoute) {
    const rootRoute: RouteKey = "root"
    const path = to.redirectedFrom?.name === rootRoute ? "/" : to.fullPath

    return {
      path,
      replace: true,
      query: to.query,
      hash: to.hash
    }
  }

  return null
}

/**
 * 处理路由切换
 *
 * 根据路由元信息中的 `href`，决定是打开新页面还是继续导航。
 *
 * @param to - 目标路由
 * @param from - 来源路由
 * @param next - 导航回调
 */
function handleRouteSwitch(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  // 处理包含外部链接的路由
  if (to.meta.href) {
    window.open(to.meta.href, "_blank")

    next({ path: from.fullPath, replace: true, query: from.query, hash: to.hash })

    return
  }

  next()
}

/**
 * 获取登录路由的查询参数
 *
 * 根据目标路由信息生成登录路由的重定向查询参数。
 *
 * @param to - 目标路由
 * @param routeHome - 首页路由名称
 * @returns 登录路由的查询参数
 */
function getRouteQueryOfLoginRoute(to: RouteLocationNormalized, routeHome: RouteKey) {
  const loginRoute: RouteKey = "login"
  const redirect = to.fullPath
  const [redirectPath, redirectQuery] = redirect.split("?")
  const redirectName = getRouteName(redirectPath as RoutePath)

  const isRedirectHome = routeHome === redirectName

  const query: LocationQueryRaw = to.name !== loginRoute && !isRedirectHome ? { redirect } : {}

  if (isRedirectHome && redirectQuery) {
    query.redirect = `/?${redirectQuery}`
  }

  return query
}
