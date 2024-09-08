const LAYOUT_PREFIX = "layout." // 布局前缀
const VIEW_PREFIX = "view." // 视图前缀
const FIRST_LEVEL_ROUTE_COMPONENT_SPLIT = "$" // 一级路由组件分隔符

/**
 * 根据组件名称获取布局和页面名称
 *
 * @param component 组件名称（可选）
 * @returns 返回包含布局和页面的对象
 */
export function getLayoutAndPage(component?: string | null) {
  let layout = ""
  let page = ""

  // 拆分组件名称，获取布局或页面以及页面项
  const [layoutOrPage = "", pageItem = ""] = component?.split(FIRST_LEVEL_ROUTE_COMPONENT_SPLIT) || []

  // 获取布局名称
  layout = getLayout(layoutOrPage)
  // 获取页面名称，如果没有页面项，则使用布局或页面名称
  page = getPage(pageItem || layoutOrPage)

  return { layout, page }
}

/**
 * 获取布局名称
 *
 * @param layout 布局字符串
 * @returns 返回处理后的布局名称
 */
function getLayout(layout: string) {
  return layout.startsWith(LAYOUT_PREFIX) ? layout.replace(LAYOUT_PREFIX, "") : ""
}

/**
 * 获取页面名称
 *
 * @param page 页面字符串
 * @returns 返回处理后的页面名称
 */
function getPage(page: string) {
  return page.startsWith(VIEW_PREFIX) ? page.replace(VIEW_PREFIX, "") : ""
}

/**
 * 将布局和页面转换为组件名称
 *
 * @param layout 布局名称
 * @param page 页面名称
 * @returns 返回拼接后的组件名称
 */
export function transformLayoutAndPageToComponent(layout: string, page: string) {
  const hasLayout = Boolean(layout) // 判断是否有布局
  const hasPage = Boolean(page) // 判断是否有页面

  // 如果同时有布局和页面，拼接并返回
  if (hasLayout && hasPage) {
    return `${LAYOUT_PREFIX}${layout}${FIRST_LEVEL_ROUTE_COMPONENT_SPLIT}${VIEW_PREFIX}${page}`
  }

  // 只有布局时返回布局
  if (hasLayout) {
    return `${LAYOUT_PREFIX}${layout}`
  }

  // 只有页面时返回页面
  if (hasPage) {
    return `${VIEW_PREFIX}${page}`
  }

  // 如果都没有，返回空字符串
  return ""
}

/**
 * 根据路由名称获取路由路径
 *
 * @param routeName 路由名称
 * @returns 返回生成的路由路径
 */
export function getRoutePathByRouteName(routeName: string) {
  return `/${routeName.replace(/_/g, "/")}`
}

/**
 * 从路由路径中获取路径参数
 *
 * @param routePath 路由路径
 * @returns 返回包含路径和参数的对象
 */
export function getPathParamFromRoutePath(routePath: string) {
  const [path, param = ""] = routePath.split("/:")

  return {
    path, // 路径
    param // 参数
  }
}

/**
 * 根据路由路径和参数生成新的路由路径
 *
 * @param routePath 路由路径
 * @param param 路径参数
 * @returns 返回带参数的路由路径
 */
export function getRoutePathWithParam(routePath: string, param: string) {
  if (param.trim()) {
    return `${routePath}/:${param}`
  }

  return routePath
}
