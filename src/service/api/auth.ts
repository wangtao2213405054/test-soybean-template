import { request } from "../request"

/** 获取公钥 */
export function getPublicKey() {
  return request<string>({
    url: "auth/getPublicKey",
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
    url: "/auth/userLogin",
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
    url: "/auth/getUserInfo",
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
    url: "/auth/refreshToken",
    method: "POST",
    data: {
      refreshToken
    }
  })
}
