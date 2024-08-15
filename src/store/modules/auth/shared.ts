import { localStg } from "@/utils/storage"

/** 获取 token */
export function getToken() {
  return localStg.get("token") || ""
}

/** 清除认证存储 */
export function clearAuthStorage() {
  localStg.remove("token")
  localStg.remove("refreshToken")
}
