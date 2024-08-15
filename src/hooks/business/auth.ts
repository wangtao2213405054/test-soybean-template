import { useAuthStore } from "@/store/modules/auth"

export function useAuth() {
  const authStore = useAuthStore()

  /**
   * 检查用户是否有权限
   *
   * @param codes 权限码，可以是单个字符串或字符串数组
   * @returns 如果用户已登录且拥有指定权限，则返回 true；否则返回 false
   */
  function hasAuth(codes: string | string[]): boolean {
    // 如果用户未登录，直接返回 false
    if (!authStore.isLogin) {
      return false
    }

    // 如果 `codes` 是单个字符串，检查用户的权限中是否包含该字符串
    if (typeof codes === "string") {
      return authStore.userInfo.buttons.includes(codes)
    }

    // 如果 `codes` 是字符串数组，检查用户的权限中是否包含数组中的任意一个字符串
    return codes.some((code) => authStore.userInfo.buttons.includes(code))
  }

  return {
    hasAuth
  }
}
