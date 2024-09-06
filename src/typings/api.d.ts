/**
 * Namespace Api
 *
 * 所有后端 API 类型
 */
declare namespace Api {
  namespace Common {
    /** 分页的公共参数 */
    interface PaginatingCommonParams {
      /** 当前页码 */
      page: number
      /** 每页大小 */
      pageSize: number
      /** 总记录数 */
      total: number
    }

    /** 分页查询记录的公共参数 */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      /** 记录列表 */
      records: T[]
    }

    /** 表格的公共搜索参数 */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, "current" | "size">

    /**
     * 启用状态
     *
     * - "1": 启用
     * - "2": 禁用
     */
    type EnableStatus = "1" | "2"

    /** 公共记录 */
    type CommonRecord<T = any> = {
      /** 记录 ID */
      id: number
      /** 记录创建者 */
      createBy: string
      /** 记录创建时间 */
      createTime: string
      /** 记录更新者 */
      updateBy: string
      /** 记录更新时间 */
      updateTime: string
      /** 记录状态 */
      status: EnableStatus | null
    } & T
  }

  /**
   * namespace Route
   *
   * 后端 API 模块: "route"
   */
  namespace Route {
    type ElegantConstRoute = import("@elegant-router/types").ElegantConstRoute

    /** 菜单路由 */
    interface MenuRoute extends ElegantConstRoute {
      /** 路由 ID */
      id: string
    }

    /** 用户路由 */
    interface UserRoute {
      /** 用户的路由列表 */
      routes: MenuRoute[]
      /** 用户的首页路由 */
      home: import("@elegant-router/types").LastLevelRouteKey
    }
  }
  namespace SystemManage {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, "current" | "size">

    /** role */
    type Role = Common.CommonRecord<{
      /** role name */
      roleName: string
      /** role code */
      roleCode: string
      /** role description */
      roleDesc: string
    }>

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, "roleName" | "roleCode" | "status"> & CommonSearchParams
    >

    /** role list */
    type RoleList = Common.PaginatingQueryRecord<Role>

    /** all role */
    type AllRole = Pick<Role, "id" | "roleName" | "roleCode">

    /**
     * user gender
     *
     * - "1": "male"
     * - "2": "female"
     */
    type UserGender = "1" | "2"

    /** user */
    type User = Common.CommonRecord<{
      /** user name */
      userName: string
      /** user gender */
      userGender: UserGender | null
      /** user nick name */
      nickName: string
      /** user phone */
      userPhone: string
      /** user email */
      userEmail: string
      /** user role code collection */
      userRoles: string[]
    }>

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.User, "userName" | "userGender" | "nickName" | "userPhone" | "userEmail" | "status"> &
        CommonSearchParams
    >

    /** user list */
    type UserList = Common.PaginatingQueryRecord<User>

    /**
     * menu type
     *
     * - "1": directory
     * - "2": menu
     */
    type MenuType = "1" | "2"

    type MenuButton = {
      /**
       * button code
       *
       * it can be used to control the button permission
       */
      code: string
      /** button description */
      desc: string
    }

    /**
     * icon type
     *
     * - "1": iconify icon
     * - "2": local icon
     */
    type IconType = "1" | "2"

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

    type Menu = Common.CommonRecord<{
      /** parent menu id */
      parentId: number
      /** menu type */
      menuType: MenuType
      /** menu name */
      menuName: string
      /** route name */
      routeName: string
      /** route path */
      routePath: string
      /** component */
      component?: string
      /** iconify icon name or local icon name */
      icon: string
      /** icon type */
      iconType: IconType
      /** buttons */
      buttons?: MenuButton[] | null
      /** children menu */
      children?: Menu[] | null
    }> &
      MenuPropsOfRoute

    /** menu list */
    type MenuList = Common.PaginatingQueryRecord<Menu>

    type MenuTree = {
      id: number
      label: string
      pId: number
      children?: MenuTree[]
    }
  }
}
