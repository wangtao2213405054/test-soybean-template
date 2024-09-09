import type { Router } from "vue-router"
import type { LastLevelRouteKey, RouteKey, RouteMap } from "@elegant-router/types"
import { getRoutePath } from "@/router/elegant/transform"

/**
 * 获取所有 tabs
 *
 * @param tabs Tabs 列表
 * @param homeTab 首页 tab
 */
export function getAllTabs(tabs: App.Global.Tab[], homeTab?: App.Global.Tab) {
  if (!homeTab) {
    return []
  }

  const filterHomeTabs = tabs.filter((tab) => tab.id !== homeTab.id)

  const fixedTabs = filterHomeTabs.filter(isFixedTab).sort((a, b) => a.fixedIndex! - b.fixedIndex!)

  const remainTabs = filterHomeTabs.filter((tab) => !isFixedTab(tab))

  const allTabs = [homeTab, ...fixedTabs, ...remainTabs]

  return updateTabsLabel(allTabs)
}

/**
 * 判断是否是固定 tab
 *
 * @param tab Tab 对象
 */
function isFixedTab(tab: App.Global.Tab) {
  return tab.fixedIndex !== undefined && tab.fixedIndex !== null
}

/**
 * 根据路由获取 tab id
 *
 * @param route 路由对象
 */
export function getTabIdByRoute(route: App.Global.TabRoute) {
  const { path, query = {}, meta } = route

  let id = path

  if (meta.multiTab) {
    const queryKeys = Object.keys(query).sort()
    const qs = queryKeys.map((key) => `${key}=${query[key]}`).join("&")

    id = `${path}?${qs}`
  }

  return id
}

/**
 * 根据路由获取 tab 对象
 *
 * @param route 路由对象
 */
export function getTabByRoute(route: App.Global.TabRoute) {
  const { name, path, fullPath = path, meta } = route

  const { title, fixedIndexInTab } = meta

  // 从 getRouteIcons 函数获取 icon 和 localIcon
  const { icon, localIcon } = getRouteIcons(route)

  const tab: App.Global.Tab = {
    id: getTabIdByRoute(route),
    label: title,
    routeKey: name as LastLevelRouteKey,
    routePath: path as RouteMap[LastLevelRouteKey],
    fullPath,
    fixedIndex: fixedIndexInTab,
    icon,
    localIcon,
    homepage: Boolean(route.meta?.homepage)
  }

  return tab
}

/**
 * 获取路由的图标
 *
 * @param route 路由对象
 */
export function getRouteIcons(route: App.Global.TabRoute) {
  // 设置默认图标值
  let icon: string = route?.meta?.icon || import.meta.env.VITE_MENU_ICON
  let localIcon: string | undefined = route?.meta?.localIcon

  // route.matched 仅在有多个匹配时出现，所以需要检查 route.matched 是否存在
  if (route.matched) {
    // 从 matched 中找到当前路由的 meta
    const currentRoute = route.matched.find((r) => r.name === route.name)
    // 如果 currentRoute.meta 中存在图标，将覆盖默认值
    icon = currentRoute?.meta?.icon || icon
    localIcon = currentRoute?.meta?.localIcon
  }

  return { icon, localIcon }
}

/**
 * 获取默认首页 tab
 *
 * @param router 路由对象
 * @param homeRouteName useRouteStore 中的 homeRoute 名称
 */
export function getDefaultHomeTab(router: Router, homeRouteName: LastLevelRouteKey) {
  const homeRoutePath = getRoutePath(homeRouteName)
  let homeTab: App.Global.Tab = {
    id: getRoutePath(homeRouteName),
    label: homeRouteName,
    routeKey: homeRouteName,
    routePath: homeRoutePath,
    fullPath: homeRoutePath
  }

  const routes = router.getRoutes()
  const homeRoute = routes.find((route) => route.name === homeRouteName)
  if (homeRoute) {
    homeTab = getTabByRoute(homeRoute)
  }

  return homeTab
}

/**
 * 判断 tab 是否在 tabs 中
 *
 * @param tabId Tab id
 * @param tabs Tabs 列表
 */
export function isTabInTabs(tabId: string, tabs: App.Global.Tab[]) {
  return tabs.some((tab) => tab.id === tabId)
}

/**
 * 根据 tab id 过滤 tabs
 *
 * @param tabId Tab id
 * @param tabs Tabs 列表
 */
export function filterTabsById(tabId: string, tabs: App.Global.Tab[]) {
  return tabs.filter((tab) => tab.id !== tabId)
}

/**
 * 根据多个 tab id 过滤 tabs
 *
 * @param tabIds Tab ids 列表
 * @param tabs Tabs 列表
 */
export function filterTabsByIds(tabIds: string[], tabs: App.Global.Tab[]) {
  return tabs.filter((tab) => !tabIds.includes(tab.id))
}

/**
 * 根据所有路由提取 tabs
 *
 * @param router 路由对象
 * @param tabs Tabs 列表
 */
export function extractTabsByAllRoutes(router: Router, tabs: App.Global.Tab[]) {
  const routes = router.getRoutes()

  const routeNames = routes.map((route) => route.name)

  return tabs.filter((tab) => routeNames.includes(tab.routeKey))
}

/**
 * 获取固定 tabs
 *
 * @param tabs Tabs 列表
 */
export function getFixedTabs(tabs: App.Global.Tab[]) {
  return tabs.filter(isFixedTab)
}

/**
 * 获取固定 tab ids
 *
 * @param tabs Tabs 列表
 */
export function getFixedTabIds(tabs: App.Global.Tab[]) {
  const fixedTabs = getFixedTabs(tabs)

  return fixedTabs.map((tab) => tab.id)
}

/**
 * 更新 tabs 标签
 *
 * @param tabs Tabs 列表
 */
function updateTabsLabel(tabs: App.Global.Tab[]) {
  return tabs.map((tab) => ({
    ...tab,
    label: tab.newLabel || tab.oldLabel || tab.label
  }))
}

/**
 * 根据 i18n key 更新 tab
 *
 * @param tab Tab 对象
 */
export function updateTabByI18nKey(tab: App.Global.Tab) {
  const { label } = tab

  return {
    ...tab,
    label
  }
}

/**
 * 根据 i18n key 更新 tabs
 *
 * @param tabs Tabs 列表
 */
export function updateTabsByI18nKey(tabs: App.Global.Tab[]) {
  return tabs.map((tab) => updateTabByI18nKey(tab))
}

/**
 * 根据路由名称查找 tab
 *
 * @param name 路由名称
 * @param tabs Tabs 列表
 */
export function findTabByRouteName(name: RouteKey, tabs: App.Global.Tab[]) {
  const routePath = getRoutePath(name)

  const tabId = routePath
  const multiTabId = `${routePath}?`

  return tabs.find((tab) => tab.id === tabId || tab.id.startsWith(multiTabId))
}
