import { request } from "../request"

/**
 * 获取角色列表
 *
 * @returns 返回角色列表的请求结果
 */
export function fetchGetRoleList(data?: SystemManage.RoleSearchParams) {
  return request<SystemManage.RoleList>({
    url: "/manage/getRoleList",
    method: "POST",
    data
  })
}

/**
 * 添加/修改角色
 *
 * @returns 返回编辑角色后的请求结果
 */
export function editRoleInfo(data: SystemManage.RoleEdit) {
  return request<SystemManage.Role>({
    url: "/manage/editRoleInfo",
    method: "PUT",
    data
  })
}

/**
 * 修改角色绑定权限信息
 *
 * @returns 返回编辑角色后的请求结果
 */
export function editRolePermissionInfo(data: SystemManage.RoleUpdatePermission) {
  return request<SystemManage.Role>({
    url: "/manage/updateRolePermission",
    method: "PUT",
    data
  })
}

/**
 * 删除角色
 *
 * @returns 返回删除后的角色
 */
export function deleteRoleInfo(id: number) {
  return request<SystemManage.Role>({
    url: "/manage/deleteRole",
    method: "DELETE",
    data: { id }
  })
}

/**
 * 批量删除菜单
 *
 * @returns 返回删除后的菜单列表
 */
export function batchDeleteRoleInfo(ids: number[]) {
  return request<SystemManage.RoleList>({
    url: "/manage/batchDeleteRole",
    method: "DELETE",
    data: { ids }
  })
}

/**
 * 获取菜单列表
 *
 * @returns 返回菜单列表的请求结果
 */
export function fetchGetMenuList(data: Api.Common.CommonSearchParams) {
  return request<SystemManage.MenuList>({
    url: "/manage/getMenuList",
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
    url: "/manage/editMenuInfo",
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
  return request<SystemManage.MenuList>({
    url: "/manage/deleteMenu",
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
  return request<SystemManage.MenuList>({
    url: "/manage/batchDeleteMenu",
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
    url: "/manage/getPageAll",
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
    url: "/manage/getRouterMenuAll",
    method: "GET"
  })
}

/**
 * 获取权限菜单列表
 *
 * @returns 返回菜单树的请求结果
 */
export function getPermissionMenuList(menuType: SystemManage.MenuPermissionType) {
  return request<SystemManage.MenuPermission[]>({
    url: "/manage/getPermissionMenuAll",
    method: "POST",
    data: { menuType }
  })
}
