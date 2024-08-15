import NProgress from "nprogress"

/** 设置 NProgress 插件 */
export function setupNProgress() {
  // 配置 NProgress 的属性
  NProgress.configure({ easing: "ease", speed: 500 })

  // 将 NProgress 挂载到全局对象 window 上
  window.NProgress = NProgress
}
