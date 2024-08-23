import { request } from "../request"

/**
 * namespace Auth
 *
 * 后端 API 模块: "auth"
 */
export namespace Auth {
  /** 登录令牌 */
  export interface LoginToken {
    /** 访问令牌 */
    accessToken: string
    /** 刷新令牌 */
    refreshToken: string
  }

  /** 用户信息 */
  export interface UserInfo {
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

/** 获取公钥 */
export function getPublicKey() {
  return request<string>({
    url: "auth/public/key",
    method: "GET"
  })
}

/**
 * 用户登录
 *
 * @param username 用户名
 * @param password 密码
 */
export function fetchLogin(username: string, password: string) {
  return request<Auth.LoginToken>({
    url: "/auth/user/login",
    method: "POST",
    data: {
      username,
      password
    }
  })
}

/** 获取用户信息 */
export function fetchGetUserInfo() {
  return request<Auth.UserInfo>({
    url: "/auth/user/info",
    method: "GET"
  })
}

/**
 * 刷新令牌
 *
 * @param refreshToken 刷新令牌
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Auth.LoginToken>({
    url: "/auth/refresh/token",
    method: "POST",
    data: {
      refreshToken
    }
  })
}
