import { ref } from "vue"
import type { Ref } from "vue"
import { createFlatRequest } from "@sa/axios"
import type {
  AxiosError,
  CreateAxiosDefaults,
  CustomAxiosRequestConfig,
  MappedType,
  RequestOption,
  ResponseType
} from "@sa/axios"
import useLoading from "./use-loading"

export type HookRequestInstanceResponseSuccessData<T = any> = {
  data: Ref<T>
  error: Ref<null>
}

export type HookRequestInstanceResponseFailData<ResponseData = any> = {
  data: Ref<null>
  error: Ref<AxiosError<ResponseData>>
}

export type HookRequestInstanceResponseData<T = any, ResponseData = any> = {
  loading: Ref<boolean>
} & (HookRequestInstanceResponseSuccessData<T> | HookRequestInstanceResponseFailData<ResponseData>)

export interface HookRequestInstance<ResponseData = any> {
  <T = any, R extends ResponseType = "json">(
    config: CustomAxiosRequestConfig
  ): HookRequestInstanceResponseData<MappedType<R, T>, ResponseData>
  cancelRequest: (requestId: string) => void
  cancelAllRequest: () => void
}

/**
 * 创建一个钩子请求实例
 *
 * @param axiosConfig Axios 配置
 * @param options 请求选项
 */
export default function createHookRequest<ResponseData = any>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>
) {
  // 使用 createFlatRequest 函数创建基础的请求实例
  const request = createFlatRequest<ResponseData>(axiosConfig, options)

  // 定义 HookRequest 实例
  const hookRequest: HookRequestInstance<ResponseData> = function hookRequest<T = any, R extends ResponseType = "json">(
    config: CustomAxiosRequestConfig
  ) {
    const { loading, startLoading, endLoading } = useLoading() // 管理加载状态

    // 定义响应数据和错误的引用
    const data = ref<MappedType<R, T> | null>(null) as Ref<MappedType<R, T>>
    const error = ref<AxiosError<ResponseData> | null>(null) as Ref<AxiosError<ResponseData> | null>

    startLoading() // 开始加载

    // 发送请求并处理响应
    request(config).then((res) => {
      if (res.data) {
        data.value = res.data // 如果请求成功，设置数据
      } else {
        error.value = res.error // 如果请求失败，设置错误信息
      }

      endLoading() // 结束加载
    })

    // 返回请求的状态、数据和错误信息
    return {
      loading,
      data,
      error
    }
  } as HookRequestInstance<ResponseData>

  // 添加取消请求的方法
  hookRequest.cancelRequest = request.cancelRequest
  hookRequest.cancelAllRequest = request.cancelAllRequest

  return hookRequest
}
