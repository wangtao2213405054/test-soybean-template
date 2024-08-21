import { computed, reactive, ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { useLoading } from "@sa/hooks"
import { SetupStoreId } from "@/enum"
import { useRouterPush } from "@/hooks/common/router"
import { fetchGetUserInfo, fetchLogin } from "@/service/api"
import { localStg } from "@/utils/storage"
import { $t } from "@/locales"
import { useRouteStore } from "../route"
import { useTabStore } from "../tab"
import { clearAuthStorage, getToken } from "./shared"

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute()
  const routeStore = useRouteStore()
  const tabStore = useTabStore()
  const { toLogin, redirectFromLogin } = useRouterPush(false)
  const { loading: loginLoading, startLoading, endLoading } = useLoading()

  // 存储 token
  const token = ref(getToken())

  // 存储用户信息
  const userInfo: Api.Auth.UserInfo = reactive({
    userId: "",
    userName: "",
    roles: [],
    buttons: []
  })

  /** 是否是静态路由中的超级角色 */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env

    return VITE_AUTH_ROUTE_MODE === "static" && userInfo.roles.includes(VITE_STATIC_SUPER_ROLE)
  })

  /** 是否登录 */
  const isLogin = computed(() => Boolean(token.value))

  /** 重置认证 store */
  async function resetStore() {
    const authStore = useAuthStore()

    clearAuthStorage()

    authStore.$reset()

    if (!route.meta.constant) {
      await toLogin()
    }

    tabStore.cacheTabs()
    await routeStore.resetStore()
  }

  /**
   * 登录
   *
   * @param userName 用户名
   * @param password 密码
   * @param [redirect=true] 是否登录后重定向，默认为 `true`. Default is `true`
   */
  async function login(userName: string, password: string, redirect = true) {
    startLoading()

    const { data: loginToken, error } = await fetchLogin(userName, password)

    if (!error) {
      const pass = await loginByToken(loginToken)

      if (pass) {
        await routeStore.initAuthRoute()

        if (redirect) {
          await redirectFromLogin()
        }

        if (routeStore.isInitAuthRoute) {
          window.$notification?.success({
            title: $t("page.login.common.loginSuccess"),
            content: $t("page.login.common.welcomeBack", { userName: userInfo.userName }),
            duration: 4500
          })
        }
      }
    } else {
      resetStore()
    }

    endLoading()
  }

  /**
   * 使用 token 登录
   *
   * @param loginToken 登录 token
   */
  async function loginByToken(loginToken: Api.Auth.LoginToken) {
    // 1. 存储在 localStorage 中，后续请求需要在请求头中带上
    localStg.set("token", loginToken.token)
    localStg.set("refreshToken", loginToken.refreshToken)

    // 2. 获取用户信息
    const pass = await getUserInfo()

    if (pass) {
      token.value = loginToken.token

      return true
    }

    return false
  }

  /** 获取用户信息 */
  async function getUserInfo() {
    const { data: info, error } = await fetchGetUserInfo()

    if (!error) {
      // 更新 store
      Object.assign(userInfo, info)

      return true
    }

    return false
  }

  /** 初始化用户信息 */
  async function initUserInfo() {
    const hasToken = getToken()

    if (hasToken) {
      const pass = await getUserInfo()

      if (!pass) {
        resetStore()
      }
    }
  }

  return {
    token,
    userInfo,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login,
    initUserInfo
  }
})
