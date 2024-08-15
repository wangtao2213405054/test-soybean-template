import type { CreateAxiosDefaults } from "axios"
import type { IAxiosRetryConfig } from "axios-retry"
import { stringify } from "qs"
import { isHttpSuccess } from "./shared"
import type { RequestOption } from "./type"

/**
 * 创建默认的请求选项
 *
 * @param options - 自定义请求选项
 * @returns 默认请求选项
 */
export function createDefaultOptions<ResponseData = any>(options?: Partial<RequestOption<ResponseData>>) {
  const opts: RequestOption<ResponseData> = {
    onRequest: async (config) => config, // 请求时的钩子函数
    isBackendSuccess: (_response) => true, // 后端成功的判断函数
    onBackendFail: async () => {}, // 后端失败时的钩子函数
    transformBackendResponse: async (response) => response.data, // 转换后端响应数据的函数
    onError: async () => {} // 错误处理函数
  }

  // 合并自定义选项
  Object.assign(opts, options)

  return opts
}

/**
 * 创建重试配置
 *
 * @param config - 自定义 Axios 配置
 * @returns 重试配置
 */
export function createRetryOptions(config?: Partial<CreateAxiosDefaults>) {
  const retryConfig: IAxiosRetryConfig = {
    retries: 0 // 默认不重试
  }

  // 合并自定义配置
  Object.assign(retryConfig, config)

  return retryConfig
}

/**
 * 创建 Axios 配置
 *
 * @param config - 自定义 Axios 配置
 * @returns Axios 配置
 */
export function createAxiosConfig(config?: Partial<CreateAxiosDefaults>) {
  const TEN_SECONDS = 10 * 1000

  const axiosConfig: CreateAxiosDefaults = {
    timeout: TEN_SECONDS, // 请求超时时间
    headers: {
      "Content-Type": "application/json" // 默认请求头
    },
    validateStatus: isHttpSuccess, // 状态码验证函数
    paramsSerializer: (params) => {
      return stringify(params) // 参数序列化函数
    }
  }

  // 合并自定义配置
  Object.assign(axiosConfig, config)

  return axiosConfig
}
