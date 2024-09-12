import { computed, ref, shallowRef } from "vue"
import type { RouteRecordRaw } from "vue-router"
import { defineStore } from "pinia"
import { useBoolean } from "@sa/hooks"
import type { CustomRoute, ElegantConstRoute, LastLevelRouteKey, RouteKey, RouteMap } from "@elegant-router/types"
import { SetupStoreId } from "@/enum"
import { router } from "@/router"
import { createStaticRoutes, getAuthVueRoutes } from "@/router/routes"
import { ROOT_ROUTE } from "@/router/routes/builtin"
import { getRouteName, getRoutePath } from "@/router/elegant/transform"
import { fetchGetConstantRoutes, fetchGetUserRoutes, fetchIsRouteExist } from "@/service/api"
import { useAppStore } from "../app"
import { useAuthStore } from "../auth"
import { useTabStore } from "../tab"
import {
  filterAuthRoutesByRoles,
  getBreadcrumbsByRoute,
  getCacheRouteNames,
  getGlobalMenusByAuthRoutes,
  getSelectedMenuKeyPathByKey,
  isRouteExistByRouteName,
  sortRoutesByOrder,
  transformMenuToSearchMenus,
  updateLocaleOfGlobalMenus
} from "./shared"

export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const appStore = useAppStore()
  const authStore = useAuthStore()
  const tabStore = useTabStore()
  const { bool: isInitConstantRoute, setBool: setIsInitConstantRoute } = useBoolean()
  const { bool: isInitAuthRoute, setBool: setIsInitAuthRoute } = useBoolean()

  /**
   * 认证路由模式
   *
   * 推荐在开发环境中使用静态模式，在生产环境中使用动态模式。如果在开发环境中使用静态模式， 认证路由将由 "@elegant-router/vue" 插件自动生成。
   */
  const authRouteMode = ref(import.meta.env.VITE_AUTH_ROUTE_MODE)

  /** 首页路由键 */
  const routeHome = ref(import.meta.env.VITE_ROUTE_HOME)

  /**
   * 设置首页路由
   *
   * @param routeKey 路由键
   */
  function setRouteHome(routeKey: LastLevelRouteKey) {
    routeHome.value = routeKey
  }

  /** 常量路由 */
  const constantRoutes = shallowRef<ElegantConstRoute[]>([])

  function addConstantRoutes(routes: ElegantConstRoute[]) {
    const constantRoutesMap = new Map<string, ElegantConstRoute>([])

    routes.forEach((route) => {
      constantRoutesMap.set(route.name, route)
    })

    constantRoutes.value = Array.from(constantRoutesMap.values())
  }

  /** 认证路由 */
  const authRoutes = shallowRef<ElegantConstRoute[]>([])

  function addAuthRoutes(routes: ElegantConstRoute[]) {
    const authRoutesMap = new Map<string, ElegantConstRoute>([])

    routes.forEach((route) => {
      authRoutesMap.set(route.name, route)
    })

    authRoutes.value = Array.from(authRoutesMap.values())
  }

  const removeRouteFns: (() => void)[] = []

  /** 全局菜单 */
  const menus = ref<App.Global.Menu[]>([])
  const searchMenus = computed(() => transformMenuToSearchMenus(menus.value))

  /** 获取全局菜单 */
  function getGlobalMenus(routes: ElegantConstRoute[]) {
    menus.value = getGlobalMenusByAuthRoutes(routes)
  }

  /** 根据语言环境更新全局菜单 */
  function updateGlobalMenusByLocale() {
    menus.value = updateLocaleOfGlobalMenus(menus.value)
  }

  /** 缓存路由 */
  const cacheRoutes = ref<RouteKey[]>([])

  /** 所有缓存路由 */
  const allCacheRoutes = shallowRef<RouteKey[]>([])

  /**
   * 获取缓存路由
   *
   * @param routes Vue 路由
   */
  function getCacheRoutes(routes: RouteRecordRaw[]) {
    const alls = getCacheRouteNames(routes)

    cacheRoutes.value = alls
    allCacheRoutes.value = [...alls]
  }

  /**
   * 添加缓存路由
   *
   * @param routeKey 路由键
   */
  function addCacheRoutes(routeKey: RouteKey) {
    if (cacheRoutes.value.includes(routeKey)) return

    cacheRoutes.value.push(routeKey)
  }

  /**
   * 移除缓存路由
   *
   * @param routeKey 路由键
   */
  function removeCacheRoutes(routeKey: RouteKey) {
    const index = cacheRoutes.value.findIndex((item) => item === routeKey)

    if (index === -1) return

    cacheRoutes.value.splice(index, 1)
  }

  /**
   * 是否缓存路由
   *
   * @param routeKey 路由键
   */
  function isCachedRoute(routeKey: RouteKey) {
    return allCacheRoutes.value.includes(routeKey)
  }

  /**
   * 通过路由键重新缓存路由
   *
   * @param routeKey 路由键
   */
  async function reCacheRoutesByKey(routeKey: RouteKey) {
    if (!isCachedRoute(routeKey)) return

    removeCacheRoutes(routeKey)

    await appStore.reloadPage()

    addCacheRoutes(routeKey)
  }

  /**
   * 通过路由键集合重新缓存路由
   *
   * @param routeKeys 路由键集合
   */
  async function reCacheRoutesByKeys(routeKeys: RouteKey[]) {
    for await (const key of routeKeys) {
      await reCacheRoutesByKey(key)
    }
  }

  /** 全局面包屑 */
  const breadcrumbs = computed(() => getBreadcrumbsByRoute(router.currentRoute.value, menus.value))

  /** 重置 store */
  async function resetStore() {
    const routeStore = useRouteStore()

    routeStore.$reset()

    resetVueRoutes()

    // 重置 store 后，需要重新初始化常量路由
    await initConstantRoute()
  }

  /** 重置 Vue 路由 */
  function resetVueRoutes() {
    removeRouteFns.forEach((fn) => fn())
    removeRouteFns.length = 0
  }

  /** 初始化常量路由 */
  async function initConstantRoute() {
    if (isInitConstantRoute.value) return

    const staticRoute = createStaticRoutes()

    if (authRouteMode.value === "static") {
      addConstantRoutes(staticRoute.constantRoutes)
    } else {
      const { data, error } = await fetchGetConstantRoutes()
      if (!error) {
        addConstantRoutes(data)
      } else {
        // 如果获取常量路由失败，则使用静态常量路由
        addConstantRoutes(staticRoute.constantRoutes)
      }
    }

    handleConstantAndAuthRoutes()

    setIsInitConstantRoute(true)
  }

  /** 初始化认证路由 */
  async function initAuthRoute() {
    if (authRouteMode.value === "static") {
      initStaticAuthRoute()
    } else {
      await initDynamicAuthRoute()
    }

    tabStore.initHomeTab()
  }

  /** 初始化静态认证路由 */
  function initStaticAuthRoute() {
    const { authRoutes: staticAuthRoutes } = createStaticRoutes()

    if (authStore.isStaticSuper) {
      addAuthRoutes(staticAuthRoutes)
    } else {
      const filteredAuthRoutes = filterAuthRoutesByRoles(staticAuthRoutes, authStore.userInfo.roles)

      addAuthRoutes(filteredAuthRoutes)
    }

    handleConstantAndAuthRoutes()

    setIsInitAuthRoute(true)
  }

  /** 初始化动态认证路由 */
  async function initDynamicAuthRoute() {
    const { data, error } = await fetchGetUserRoutes()

    if (!error) {
      addAuthRoutes(data)

      handleConstantAndAuthRoutes()

      setRouteHome("project")

      handleUpdateRootRouteRedirect("project")

      setIsInitAuthRoute(true)
    } else {
      // 如果获取用户路由失败，重置 store
      await authStore.resetStore()
    }
  }

  /** 处理常量和认证路由 */
  function handleConstantAndAuthRoutes() {
    const allRoutes = [...constantRoutes.value, ...authRoutes.value]

    const sortRoutes = sortRoutesByOrder(allRoutes)

    const vueRoutes = getAuthVueRoutes(sortRoutes)

    resetVueRoutes()

    addRoutesToVueRouter(vueRoutes)

    getGlobalMenus(sortRoutes)

    getCacheRoutes(vueRoutes)
  }

  /**
   * 添加路由到 Vue 路由器
   *
   * @param routes Vue 路由
   */
  function addRoutesToVueRouter(routes: RouteRecordRaw[]) {
    routes.forEach((route) => {
      const removeFn = router.addRoute(route)
      addRemoveRouteFn(removeFn)
    })
  }

  /**
   * 添加移除路由函数
   *
   * @param fn
   */
  function addRemoveRouteFn(fn: () => void) {
    removeRouteFns.push(fn)
  }

  /**
   * 在认证路由模式为动态时更新根路由重定向
   *
   * @param redirectKey 重定向路由键
   */
  function handleUpdateRootRouteRedirect(redirectKey: LastLevelRouteKey) {
    const redirect = getRoutePath(redirectKey)

    if (redirect) {
      const rootRoute: CustomRoute = { ...ROOT_ROUTE, redirect }

      router.removeRoute(rootRoute.name)

      const [rootVueRoute] = getAuthVueRoutes([rootRoute])

      router.addRoute(rootVueRoute)
    }
  }

  /**
   * 获取认证路由是否存在
   *
   * @param routePath 路由路径
   */
  async function getIsAuthRouteExist(routePath: RouteMap[RouteKey]) {
    const routeName = getRouteName(routePath)

    if (!routeName) {
      return false
    }

    if (authRouteMode.value === "static") {
      const { authRoutes: staticAuthRoutes } = createStaticRoutes()
      return isRouteExistByRouteName(routeName, staticAuthRoutes)
    }

    const { data } = await fetchIsRouteExist(routeName)

    return data
  }

  /**
   * 获取选中的菜单键路径
   *
   * @param selectedKey 选中的菜单键
   */
  function getSelectedMenuKeyPath(selectedKey: string) {
    return getSelectedMenuKeyPathByKey(selectedKey, menus.value)
  }

  return {
    resetStore,
    routeHome,
    menus,
    searchMenus,
    updateGlobalMenusByLocale,
    cacheRoutes,
    reCacheRoutesByKey,
    reCacheRoutesByKeys,
    breadcrumbs,
    initConstantRoute,
    isInitConstantRoute,
    initAuthRoute,
    isInitAuthRoute,
    setIsInitAuthRoute,
    getIsAuthRouteExist,
    getSelectedMenuKeyPath
  }
})
