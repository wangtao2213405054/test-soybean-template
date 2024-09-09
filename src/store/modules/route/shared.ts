import type { RouteLocationNormalizedLoaded, RouteRecordRaw, _RouteRecordBase } from "vue-router"
import type { ElegantConstRoute, LastLevelRouteKey, RouteKey, RouteMap } from "@elegant-router/types"
import { useSvgIcon } from "@/hooks/common/icon"

/**
 * 根据角色过滤认证路由
 *
 * @param routes 认证路由
 * @param roles 角色
 * @returns 过滤后的路由
 */
export function filterAuthRoutesByRoles(routes: ElegantConstRoute[], roles: string[]) {
  return routes.flatMap((route) => filterAuthRouteByRoles(route, roles))
}

/**
 * 根据角色过滤单个认证路由
 *
 * @param route 认证路由
 * @param roles 角色
 * @returns 过滤后的路由
 */
function filterAuthRouteByRoles(route: ElegantConstRoute, roles: string[]) {
  const routeRoles = (route.meta && route.meta.roles) || []

  // 如果路由的 "roles" 为空，则允许访问
  const isEmptyRoles = !routeRoles.length

  // 如果用户的角色在路由的 "roles" 中，则允许访问
  const hasPermission = routeRoles.some((role) => roles.includes(role))

  const filterRoute = { ...route }

  if (filterRoute.children?.length) {
    filterRoute.children = filterRoute.children.flatMap((item) => filterAuthRouteByRoles(item, roles))
  }

  return hasPermission || isEmptyRoles ? [filterRoute] : []
}

/**
 * 按顺序排序路由
 *
 * @param route 路由
 * @returns 排序后的路由
 */
function sortRouteByOrder(route: ElegantConstRoute) {
  if (route.children?.length) {
    route.children.sort((next, prev) => (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0))
    route.children.forEach(sortRouteByOrder)
  }

  return route
}

/**
 * 按顺序排序多个路由
 *
 * @param routes 路由数组
 * @returns 排序后的路由数组
 */
export function sortRoutesByOrder(routes: ElegantConstRoute[]) {
  routes.sort((next, prev) => (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0))
  routes.forEach(sortRouteByOrder)

  return routes
}

/**
 * 根据认证路由获取全局菜单
 *
 * @param routes 认证路由
 * @returns 全局菜单
 */
export function getGlobalMenusByAuthRoutes(routes: ElegantConstRoute[]) {
  const menus: App.Global.Menu[] = []

  routes.forEach((route) => {
    if (!route.meta?.hideInMenu) {
      const menu = getGlobalMenuByBaseRoute(route)

      if (route.children?.some((child) => !child.meta?.hideInMenu)) {
        menu.children = getGlobalMenusByAuthRoutes(route.children)
      }

      menus.push(menu)
    }
  })

  return menus
}

/**
 * 更新全局菜单的语言环境
 *
 * @param menus 全局菜单
 * @returns 更新后的菜单
 */
export function updateLocaleOfGlobalMenus(menus: App.Global.Menu[]) {
  const result: App.Global.Menu[] = []

  menus.forEach((menu) => {
    const { label, children } = menu

    const newMenu: App.Global.Menu = {
      ...menu,
      label
    }

    if (children?.length) {
      newMenu.children = updateLocaleOfGlobalMenus(children)
    }

    result.push(newMenu)
  })

  return result
}

/**
 * 根据路由获取全局菜单
 *
 * @param route 路由
 * @returns 全局菜单
 */
function getGlobalMenuByBaseRoute(route: RouteLocationNormalizedLoaded | ElegantConstRoute) {
  const { SvgIconVNode } = useSvgIcon()
  const { name, path } = route
  const { title, icon = import.meta.env.VITE_MENU_ICON, localIcon, iconFontSize } = route.meta ?? {}

  const menu: App.Global.Menu = {
    key: name as string,
    label: title!,
    routeKey: name as RouteKey,
    routePath: path as RouteMap[RouteKey],
    icon: SvgIconVNode({ icon, localIcon, fontSize: iconFontSize || 20 }),
    homepage: Boolean(route.meta?.homepage)
  }

  return menu
}

/**
 * 获取缓存路由名称
 *
 * @param routes Vue 路由（两级）
 * @returns 缓存路由名称
 */
export function getCacheRouteNames(routes: RouteRecordRaw[]) {
  const cacheNames: LastLevelRouteKey[] = []

  routes.forEach((route) => {
    // 只获取最后两级路由，且有组件
    route.children?.forEach((child) => {
      if (child.component && child.meta?.keepAlive) {
        cacheNames.push(child.name as LastLevelRouteKey)
      }
    })
  })

  return cacheNames
}

/**
 * 根据路由名称判断路由是否存在
 *
 * @param routeName 路由名称
 * @param routes 路由数组
 * @returns 路由是否存在
 */
export function isRouteExistByRouteName(routeName: RouteKey, routes: ElegantConstRoute[]) {
  return routes.some((route) => recursiveGetIsRouteExistByRouteName(route, routeName))
}

/**
 * 递归判断路由名称是否存在
 *
 * @param route 路由
 * @param routeName 路由名称
 * @returns 路由是否存在
 */
function recursiveGetIsRouteExistByRouteName(route: ElegantConstRoute, routeName: RouteKey) {
  let isExist = route.name === routeName

  if (isExist) {
    return true
  }

  if (route.children && route.children.length) {
    isExist = route.children.some((item) => recursiveGetIsRouteExistByRouteName(item, routeName))
  }

  return isExist
}

/**
 * 根据选中菜单键获取菜单键路径
 *
 * @param selectedKey 选中菜单键
 * @param menus 菜单
 * @returns 菜单键路径
 */
export function getSelectedMenuKeyPathByKey(selectedKey: string, menus: App.Global.Menu[]) {
  const keyPath: string[] = []

  menus.some((menu) => {
    const path = findMenuPath(selectedKey, menu)

    const find = Boolean(path?.length)

    if (find) {
      keyPath.push(...path!)
    }

    return find
  })

  return keyPath
}

/**
 * 查找菜单路径
 *
 * @param targetKey 目标菜单键
 * @param menu 菜单
 * @returns 菜单路径
 */
function findMenuPath(targetKey: string, menu: App.Global.Menu): string[] | null {
  const path: string[] = []

  function dfs(item: App.Global.Menu): boolean {
    path.push(item.key)

    if (item.key === targetKey) {
      return true
    }

    if (item.children) {
      for (const child of item.children) {
        if (dfs(child)) {
          return true
        }
      }
    }

    path.pop()

    return false
  }

  if (dfs(menu)) {
    return path
  }

  return null
}

/**
 * 转换菜单为面包屑
 *
 * @param menu 菜单
 * @returns 面包屑
 */
function transformMenuToBreadcrumb(menu: App.Global.Menu) {
  const { children, ...rest } = menu

  const breadcrumb: App.Global.Breadcrumb = {
    ...rest
  }

  if (children?.length) {
    breadcrumb.options = children.map(transformMenuToBreadcrumb)
  }

  return breadcrumb
}

/**
 * 根据路由获取面包屑
 *
 * @param route 路由
 * @param menus 菜单
 * @returns 面包屑数组
 */
export function getBreadcrumbsByRoute(
  route: RouteLocationNormalizedLoaded,
  menus: App.Global.Menu[]
): App.Global.Breadcrumb[] {
  const key = route.name as string
  const activeKey = route.meta?.activeMenu

  const menuKey = activeKey || key

  for (const menu of menus) {
    if (menu.key === menuKey) {
      const breadcrumbMenu = menuKey !== activeKey ? menu : getGlobalMenuByBaseRoute(route)

      return [transformMenuToBreadcrumb(breadcrumbMenu)]
    }

    if (menu.children?.length) {
      const result = getBreadcrumbsByRoute(route, menu.children)
      if (result.length > 0) {
        return [transformMenuToBreadcrumb(menu), ...result]
      }
    }
  }

  return []
}

/**
 * 转换菜单为搜索菜单
 *
 * @param menus 菜单
 * @param treeMap 搜索菜单树
 * @returns 搜索菜单
 */
export function transformMenuToSearchMenus(menus: App.Global.Menu[], treeMap: App.Global.Menu[] = []) {
  if (menus && menus.length === 0) return []
  return menus.reduce((acc, cur) => {
    if (!cur.children) {
      acc.push(cur)
    }
    if (cur.children && cur.children.length > 0) {
      transformMenuToSearchMenus(cur.children, treeMap)
    }
    return acc
  }, treeMap)
}
