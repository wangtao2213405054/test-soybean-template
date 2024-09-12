import { request } from "../request"

/** get constant routes */
export function fetchGetConstantRoutes() {
  return request<Api.Route.MenuRoute[]>({
    url: "/route/getConstantRoutes",
    method: "GET"
  })
}

/** get user routes */
export function fetchGetUserRoutes() {
  return request<Api.Route.MenuRoute[]>({
    url: "/route/getUserRoutes",
    method: "GET"
  })
}

/**
 * whether the route is exist
 *
 * @param routeName route name
 */
export function fetchIsRouteExist(routeName: string) {
  return request<boolean>({
    url: "/route/isRouteExist",
    method: "POST",
    data: { routeName }
  })
}
