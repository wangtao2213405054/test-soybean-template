// @unocss-include
import { getRgb } from "@sa/color"
import { localStg } from "@/utils/storage"
import systemLogo from "@/assets/svg-icon/logo.svg?raw"

/** 设置加载动画 */
export function setupLoading() {
  // 从本地存储中获取主题颜色，如果不存在则使用默认颜色
  const themeColor = localStg.get("themeColor") || "#646cff"

  // 获取主题颜色的 RGB 值
  const { r, g, b } = getRgb(themeColor)

  // 定义主颜色的 CSS 变量
  const primaryColor = `--primary-color: ${r} ${g} ${b}`

  // 定义加载动画的 CSS 类
  const loadingClasses = [
    "left-0 top-0",
    "left-0 bottom-0 animate-delay-500",
    "right-0 top-0 animate-delay-1000",
    "right-0 bottom-0 animate-delay-1500"
  ]

  // 将 logo 添加 CSS 类
  const logoWithClass = systemLogo.replace("<svg", `<svg class="size-128px text-primary"`)

  // 生成四个加载动画的圆点
  const dot = loadingClasses
    .map((item) => {
      return `<div class="absolute w-16px h-16px bg-primary rounded-8px animate-pulse ${item}"></div>`
    })
    .join("\n")

  // 定义加载动画的 HTML 模板
  const loading = `
<div class="fixed-center flex-col" style="${primaryColor}">
  ${logoWithClass}
  <div class="w-56px h-56px my-36px">
    <div class="relative h-full animate-spin">
      ${dot}
    </div>
  </div>
  <h2 class="text-28px font-500 text-#646464">Criminal 自动化平台</h2>
</div>`

  // 将加载动画插入到页面中
  const app = document.getElementById("app")

  if (app) {
    app.innerHTML = loading
  }
}
