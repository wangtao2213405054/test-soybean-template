import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios"

export type ContentType =
  | "text/html"
  | "text/plain"
  | "multipart/form-data"
  | "application/json"
  | "application/x-www-form-urlencoded"
  | "application/octet-stream"

export interface RequestOption<ResponseData = any> {
  /**
   * 请求前的钩子
   *
   * 例如：你可以在这个钩子中添加请求头中的 token
   *
   * @param config Axios 配置对象
   */
  onRequest: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>

  /**
   * 检查后端响应是否成功的钩子
   *
   * @param response Axios 响应对象
   */
  isBackendSuccess: (response: AxiosResponse<ResponseData>) => boolean

  /**
   * 后端请求失败后的钩子
   *
   * 例如：你可以在这个钩子中处理 token 过期的情况
   *
   * @param response Axios 响应对象
   * @param instance Axios 实例
   */
  onBackendFail: (
    response: AxiosResponse<ResponseData>,
    instance: AxiosInstance
  ) => Promise<AxiosResponse | null> | Promise<void>

  /**
   * 当响应类型为 JSON 时，转换后端响应的钩子
   *
   * @param response Axios 响应对象
   */
  transformBackendResponse(response: AxiosResponse<ResponseData>): any | Promise<any>

  /**
   * 处理错误的钩子
   *
   * 例如：你可以在这个钩子中显示错误消息
   *
   * @param error Axios 错误对象
   */
  onError: (error: AxiosError<ResponseData>) => void | Promise<void>
}

interface ResponseMap {
  blob: Blob
  text: string
  arrayBuffer: ArrayBuffer
  stream: ReadableStream<Uint8Array>
  document: Document
}
export type ResponseType = keyof ResponseMap | "json"

export type MappedType<R extends ResponseType, JsonType = any> = R extends keyof ResponseMap ? ResponseMap[R] : JsonType

export type CustomAxiosRequestConfig<R extends ResponseType = "json"> = Omit<AxiosRequestConfig, "responseType"> & {
  responseType?: R
}

export interface RequestInstanceCommon<T> {
  /**
   * 通过请求 ID 取消请求
   *
   * 如果请求配置中提供了 abort controller 的信号，则不会将其收集到 abort controller map 中
   *
   * @param requestId 请求 ID
   */
  cancelRequest: (requestId: string) => void

  /**
   * 取消所有请求
   *
   * 如果请求配置中提供了 abort controller 的信号，则不会将其收集到 abort controller map 中
   */
  cancelAllRequest: () => void

  /** 你可以在请求实例中设置自定义状态 */
  state: T
}

/** 请求实例接口 */
export interface RequestInstance<S = Record<string, unknown>> extends RequestInstanceCommon<S> {
  <T = any, R extends ResponseType = "json">(config: CustomAxiosRequestConfig<R>): Promise<MappedType<R, T>>
}

export type FlatResponseSuccessData<T = any> = {
  data: T
  error: null
}

export type FlatResponseFailData<ResponseData = any> = {
  data: null
  error: AxiosError<ResponseData>
}

export type FlatResponseData<T = any, ResponseData = any> =
  | FlatResponseSuccessData<T>
  | FlatResponseFailData<ResponseData>

export interface FlatRequestInstance<S = Record<string, unknown>, ResponseData = any> extends RequestInstanceCommon<S> {
  <T = any, R extends ResponseType = "json">(
    config: CustomAxiosRequestConfig<R>
  ): Promise<FlatResponseData<MappedType<R, T>, ResponseData>>
}
