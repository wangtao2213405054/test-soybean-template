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
      current: number
      /** 每页大小 */
      size: number
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
   * namespace Auth
   *
   * 后端 API 模块: "auth"
   */
  namespace Auth {
    /** 登录令牌 */
    interface LoginToken {
      /** 访问令牌 */
      token: string
      /** 刷新令牌 */
      refreshToken: string
    }

    /** 用户信息 */
    interface UserInfo {
      /** 用户 ID */
      userId: string
      /** 用户名 */
      userName: string
      /** 角色列表 */
      roles: string[]
      /** 按钮权限列表 */
      buttons: string[]
    }
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
}
