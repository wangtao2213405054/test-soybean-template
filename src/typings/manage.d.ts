declare namespace SystemManage {
  /** 角色类型 */
  type Role = Api.Common.CommonRecord<{
    /** 角色名称 */
    roleName: string
    /** 角色代码 */
    roleCode: string
    /** 角色描述 */
    roleDesc: string
  }>

  /** 角色搜索参数 */
  type RoleSearchParams = CommonType.RecordNullable<
    Pick<Role, "roleName" | "roleCode" | "status"> & Api.Common.CommonSearchParams
  >

  /** 角色列表 */
  type RoleList = Api.Common.PaginatingQueryRecord<Role>

  /** 所有角色的简化类型 */
  type AllRole = Pick<Role, "id" | "roleName" | "roleCode">

  /**
   * 用户性别
   *
   * - "1": 男性
   * - "2": 女性
   */
  type UserGender = "1" | "2"

  /** 用户类型 */
  type User = Api.Common.CommonRecord<{
    /** 用户名称 */
    userName: string
    /** 用户性别 */
    userGender: UserGender | null
    /** 用户昵称 */
    nickName: string
    /** 用户手机号 */
    userPhone: string
    /** 用户邮箱 */
    userEmail: string
    /** 用户角色代码集合 */
    userRoles: string[]
  }>

  /** 用户搜索参数 */
  type UserSearchParams = CommonType.RecordNullable<
    Pick<User, "userName" | "userGender" | "nickName" | "userPhone" | "userEmail" | "status"> &
      Api.Common.CommonSearchParams
  >

  /** 用户列表 */
  type UserList = Api.Common.PaginatingQueryRecord<User>

  /**
   * 菜单类型
   *
   * - 1: 目录
   * - 2: 菜单
   */
  type MenuType = 1 | 2

  /** 菜单权限 */
  type MenuPermission = {
    /** 按钮代码 用于控制按钮权限 */
    code: string
    /** 按钮描述 */
    description: string
  }

  /**
   * 图标类型
   *
   * - 1: 使用 iconify 图标
   * - 2: 使用本地图标
   */
  type IconType = 1 | 2

  /** 路由菜单的属性 */
  type MenuPropsOfRoute = Pick<
    import("vue-router").RouteMeta,
    | "i18nKey"
    | "keepAlive"
    | "constant"
    | "order"
    | "href"
    | "hideInMenu"
    | "activeMenu"
    | "multiTab"
    | "fixedIndexInTab"
    | "query"
  >

  type MenuInfo = {
    /** 父菜单 ID */
    nodeId: number
    /** 菜单类型 */
    menuType: MenuType
    /** 菜单名称 */
    menuName: string
    /** 路由名称 */
    routeName: string
    /** 路由路径 */
    routePath: string
    /** 组件 */
    component?: string
    /** iconify 图标名称或本地图标名称 */
    icon: string
    /** 图标类型 */
    iconType: IconType
    /** 按钮权限 */
    buttons?: MenuPermission[] | null
    /** 接口权限 */
    interfaces?: MenuPermission[] | null
    /** 子菜单 */
    children?: Menu[] | null
  }

  /** 菜单类型 */
  type Menu = Api.Common.CommonRecord<MenuInfo> & MenuPropsOfRoute

  type MenuEdit = {
    id?: number
  } & MenuInfo &
    MenuPropsOfRoute

  /** 菜单列表 */
  type MenuList = Api.Common.PaginatingQueryRecord<Menu>

  /** 菜单树结构 */
  type MenuTree = {
    /** 菜单 ID */
    id: number
    /** 菜单标签 */
    label: string
    /** 父菜单 ID */
    pId: number
    /** 子菜单树 */
    children?: MenuTree[]
  }
}
