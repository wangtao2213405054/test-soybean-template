import type { AxiosResponse } from "axios"
import { BACKEND_ERROR_CODE, createFlatRequest, createRequest } from "@sa/axios"
import { useAuthStore } from "@/store/modules/auth"
import { localStg } from "@/utils/storage"
import { getServiceBaseURL } from "@/utils/service"
import { handleRefreshToken, showErrorMsg } from "./shared"
import type { RequestInstanceState } from "./type"

// 判断是否使用 HTTP 代理
const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === "Y"
// 获取服务的基本 URL 地址
const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy)

// 创建一个请求实例，处理主 API 请求
export const request = createFlatRequest<App.Service.Response, RequestInstanceState>(
  {
    baseURL // 请求的基本 URL
  },
  {
    // 请求拦截器
    async onRequest(config) {
      const { headers } = config

      // 设置授权 token
      const token = localStg.get("token")
      const Authorization = token ? `Bearer ${token}` : null
      Object.assign(headers, { Authorization })

      return config
    },
    // 判断后端响应是否成功
    isBackendSuccess(response) {
      // 默认情况下，后端响应码为 "0000" 表示请求成功
      // 可以通过修改 `.env` 文件中的 `VITE_SERVICE_SUCCESS_CODE` 来改变此逻辑
      return String(response.data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE
    },
    // 处理后端请求失败的情况
    async onBackendFail(response, instance) {
      const authStore = useAuthStore()
      const responseCode = String(response.data.code)

      function handleLogout() {
        authStore.resetStore()
      }

      function logoutAndCleanup() {
        handleLogout()
        window.removeEventListener("beforeunload", handleLogout)

        request.state.errMsgStack = request.state.errMsgStack.filter((msg) => msg !== response.data.message)
      }

      // 当后端响应码在 `logoutCodes` 中时，用户将被登出并重定向到登录页面
      const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(",") || []
      if (logoutCodes.includes(responseCode)) {
        handleLogout()
        return null
      }

      // 当后端响应码在 `modalLogoutCodes` 中时，用户将通过显示模态框被登出
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(",") || []
      if (modalLogoutCodes.includes(responseCode) && !request.state.errMsgStack?.includes(response.data.message)) {
        request.state.errMsgStack = [...(request.state.errMsgStack || []), response.data.message]

        // 防止用户刷新页面
        window.addEventListener("beforeunload", handleLogout)

        window.$dialog?.error({
          title: "错误", // 错误提示的标题
          content: response.data.message, // 错误提示的内容
          positiveText: "确认", // 确认按钮的文本
          maskClosable: false, // 禁止点击遮罩层关闭
          closeOnEsc: false, // 禁止按 Esc 键关闭
          onPositiveClick() {
            logoutAndCleanup()
          },
          onClose() {
            logoutAndCleanup()
          }
        })

        return null
      }

      // 当后端响应码在 `expiredTokenCodes` 中时，表示 token 已过期，刷新 token
      // `refreshToken` API 不能返回在 `expiredTokenCodes` 中的错误码，否则将形成死循环，应该返回 `logoutCodes` 或 `modalLogoutCodes`
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(",") || []
      if (expiredTokenCodes.includes(responseCode) && !request.state.isRefreshingToken) {
        request.state.isRefreshingToken = true

        const refreshConfig = await handleRefreshToken(response.config)

        request.state.isRefreshingToken = false

        if (refreshConfig) {
          return instance.request(refreshConfig) as Promise<AxiosResponse>
        }
      }

      return null
    },
    // 转换后端响应数据
    transformBackendResponse(response) {
      return response.data.data
    },
    // 请求失败的处理
    onError(error) {
      // 显示错误信息

      let message = error.message
      let backendErrorCode = ""

      // 获取后端错误信息和代码
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || message
        backendErrorCode = String(error.response?.data?.code || "")
      }

      // 如果错误码在 `modalLogoutCodes` 中，则不显示错误信息
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(",") || []
      if (modalLogoutCodes.includes(backendErrorCode)) {
        return
      }

      // 如果 token 过期，则刷新 token 并重试请求，所以不需要显示错误信息
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(",") || []
      if (expiredTokenCodes.includes(backendErrorCode)) {
        return
      }

      showErrorMsg(request.state, message)
    }
  }
)

// 创建一个请求实例，用于演示请求
export const demoRequest = createRequest<App.Service.DemoResponse>(
  {
    baseURL: otherBaseURL.demo // 演示请求的基本 URL
  },
  {
    // 请求拦截器
    async onRequest(config) {
      const { headers } = config

      // 设置授权 token
      const token = localStg.get("token")
      const Authorization = token ? `Bearer ${token}` : null
      Object.assign(headers, { Authorization })

      return config
    },
    // 判断后端响应是否成功
    isBackendSuccess(response) {
      // 默认情况下，后端响应码为 "200" 表示请求成功
      // 可以根据需要修改此逻辑
      return response.data.status === "200"
    },
    async onBackendFail(_response) {
      // 处理后端响应失败的情况
      // 例如：token 过期，刷新 token 并重试请求
    },
    // 转换后端响应数据
    transformBackendResponse(response) {
      return response.data.result
    },
    // 请求失败的处理
    onError(error) {
      // 显示错误信息

      let message = error.message

      // 显示后端错误信息
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || message
      }

      window.$message?.error(message)
    }
  }
)
