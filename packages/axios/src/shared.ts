import type { AxiosHeaderValue, AxiosResponse, InternalAxiosRequestConfig } from "axios"

/**
 * 获取请求的 Content-Type
 *
 * @param config - 请求配置对象
 * @returns 请求的 Content-Type
 */
export function getContentType(config: InternalAxiosRequestConfig) {
  const contentType: AxiosHeaderValue = config.headers?.["Content-Type"] || "application/json"

  return contentType
}

/**
 * 检查 HTTP 状态码是否表示请求成功
 *
 * @param status - HTTP 状态码
 * @returns 如果状态码表示成功，则返回 true；否则返回 false
 */
export function isHttpSuccess(status: number) {
  const isSuccessCode = status >= 200 && status < 300
  return isSuccessCode || status === 304
}

/**
 * 检查响应是否为 JSON 格式
 *
 * @param response - Axios 响应对象
 * @returns 如果响应为 JSON 格式，则返回 true；否则返回 false
 */
export function isResponseJson(response: AxiosResponse) {
  const { responseType } = response.config

  return responseType === "json" || responseType === undefined
}
