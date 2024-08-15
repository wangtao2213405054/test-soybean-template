import { addAPIProvider, disableCache } from "@iconify/vue"

/** 设置 Iconify 离线模式 */
export function setupIconifyOffline() {
  const { VITE_ICONIFY_URL } = import.meta.env

  if (VITE_ICONIFY_URL) {
    // 添加 Iconify API 提供者，使用指定的资源 URL
    addAPIProvider("", { resources: [VITE_ICONIFY_URL] })

    // 禁用所有缓存
    disableCache("all")
  }
}
