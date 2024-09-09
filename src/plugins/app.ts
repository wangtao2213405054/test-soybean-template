import { h } from "vue"
import { NButton } from "naive-ui"

export function setupAppVersionNotification() {
  let isShow = false

  // 监听文档可见性变化事件
  document.addEventListener("visibilitychange", async () => {
    // 检查是否需要显示通知
    const preConditions = [!isShow, document.visibilityState === "visible", !import.meta.env.DEV]

    // 如果不满足条件，则退出
    if (!preConditions.every(Boolean)) return

    // 获取当前构建时间
    const buildTime = await getHtmlBuildTime()

    // 如果构建时间与当前一致，则退出
    if (buildTime === BUILD_TIME) {
      return
    }

    isShow = true

    // 显示通知
    const n = window.$notification?.create({
      title: "系统版本更新通知",
      content: "检测到系统有新版本发布，是否立即刷新页面？",
      action() {
        return h("div", { style: { display: "flex", justifyContent: "end", gap: "12px", width: "325px" } }, [
          h(
            NButton,
            {
              onClick() {
                n?.destroy()
              }
            },
            () => "稍后再说"
          ),
          h(
            NButton,
            {
              type: "primary",
              onClick() {
                location.reload()
              }
            },
            () => "立即刷新"
          )
        ])
      },
      onClose() {
        isShow = false
      }
    })
  })
}

async function getHtmlBuildTime() {
  const res = await fetch(`/index.html?time=${Date.now()}`)

  const html = await res.text()

  // 从 HTML 中提取构建时间
  const match = html.match(/<meta name="buildTime" content="(.*)">/)

  return match?.[1] || ""
}
