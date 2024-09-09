/**
 * namespace Auth
 *
 * 后端 API 模块: "auth"
 */
declare namespace Auth {
  /** 登录令牌 */
  interface LoginToken {
    /** 访问令牌 */
    accessToken: string
    /** 刷新令牌 */
    refreshToken: string
  }

  /** 用户信息 */
  interface UserInfo {
    createTime: string
    updateTime: string
    name: string
    username: string
    email: string
    mobile: string
    avatarUrl?: string | null
    status: boolean
    isAdmin: boolean
    roleId: number
    roles: string[]
    affiliationId: number
    id: number
    resource: null
  }
}
