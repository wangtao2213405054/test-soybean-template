import { request } from "../request"

/**
 * 获取角色列表
 *
 * @param params 可选的请求参数，用于过滤角色列表
 * @returns 返回角色列表的请求结果
 */
export function fetchGetRoleList(params?: SystemManage.RoleSearchParams) {
  return request<SystemManage.RoleList>({
    url: "/systemManage/getRoleList", // 请求的 URL 地址
    method: "get", // 请求的方法，GET 表示获取数据
    params // 请求的参数，用于筛选角色列表
  })
}

/**
 * 获取所有角色
 *
 * 返回的角色都是启用状态的
 *
 * @returns 返回所有角色的请求结果
 */
export function fetchGetAllRoles() {
  return request<SystemManage.AllRole[]>({
    url: "/systemManage/getAllRoles", // 请求的 URL 地址
    method: "get" // 请求的方法，GET 表示获取数据
  })
}

/**
 * 获取用户列表
 *
 * @param params 可选的请求参数，用于过滤用户列表
 * @returns 返回用户列表的请求结果
 */
export function fetchGetUserList(params?: SystemManage.UserSearchParams) {
  return request<SystemManage.UserList>({
    url: "/systemManage/getUserList", // 请求的 URL 地址
    method: "get", // 请求的方法，GET 表示获取数据
    params // 请求的参数，用于筛选用户列表
  })
}

/**
 * 获取菜单列表
 *
 * @returns 返回菜单列表的请求结果
 */
export function fetchGetMenuList(data: Api.Common.CommonSearchParams) {
  return request<SystemManage.MenuList>({
    url: "/manage/menu/list",
    method: "POST",
    data
  })
}

/**
 * 添加/修改菜单
 *
 * @returns 返回编辑菜单的请求结果
 */
export function editMenuInfo(data: SystemManage.MenuEdit) {
  return request<SystemManage.Menu>({
    url: "/manage/menu/edit",
    method: "PUT",
    data
  })
}

/**
 * 删除菜单
 *
 * @returns 返回删除后的菜单
 */
export function deleteMenuInfo(id: number) {
  return request<SystemManage.Menu>({
    url: "/manage/menu/delete",
    method: "DELETE",
    data: { id }
  })
}

/**
 * 批量删除菜单
 *
 * @returns 返回删除后的菜单列表
 */
export function batchDeleteMenuInfo(ids: number[]) {
  return request<SystemManage.Menu>({
    url: "/manage/menu/batch/delete",
    method: "DELETE",
    data: { ids }
  })
}

/**
 * 获取所有页面
 *
 * @returns 返回所有页面的请求结果
 */
export function fetchGetAllPages() {
  return request<string[]>({
    url: "/manage/page/all",
    method: "GET"
  })
}

/**
 * 获取菜单树
 *
 * @returns 返回菜单树的请求结果
 */
export function fetchGetMenuTree() {
  return request<SystemManage.MenuTree[]>({
    url: "/systemManage/getMenuTree", // 请求的 URL 地址
    method: "get" // 请求的方法，GET 表示获取数据
  })
}
