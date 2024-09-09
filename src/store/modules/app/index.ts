import { effectScope, nextTick, onScopeDispose, ref, watch } from "vue"
import { defineStore } from "pinia"
import { breakpointsTailwind, useBreakpoints, useEventListener, useTitle } from "@vueuse/core"
import { useBoolean } from "@sa/hooks"
import { SetupStoreId } from "@/enum"
import { router } from "@/router"
import { setLocale } from "@/locales"
import { setDayjsLocale } from "@/locales/dayjs"
import { localStg } from "@/utils/storage"
import { useRouteStore } from "../route"
import { useTabStore } from "../tab"
import { useThemeStore } from "../theme"

export const useAppStore = defineStore(SetupStoreId.App, () => {
  const themeStore = useThemeStore()
  const routeStore = useRouteStore()
  const tabStore = useTabStore()
  const scope = effectScope()
  const breakpoints = useBreakpoints(breakpointsTailwind)

  // 定义可视化布尔状态的钩子
  const { bool: themeDrawerVisible, setTrue: openThemeDrawer, setFalse: closeThemeDrawer } = useBoolean()
  const { bool: reloadFlag, setBool: setReloadFlag } = useBoolean(true)
  const { bool: fullContent, toggle: toggleFullContent } = useBoolean()
  const { bool: contentXScrollable, setBool: setContentXScrollable } = useBoolean()
  const { bool: siderCollapse, setBool: setSiderCollapse, toggle: toggleSiderCollapse } = useBoolean()
  const {
    bool: mixSiderFixed,
    setBool: setMixSiderFixed,
    toggle: toggleMixSiderFixed
  } = useBoolean(localStg.get("mixSiderFixed") === "Y")

  /** 是否是移动布局 */
  const isMobile = breakpoints.smaller("sm")

  /**
   * 重新加载页面
   *
   * @param duration 持续时间
   */
  async function reloadPage(duration = 300) {
    setReloadFlag(false)

    const d = themeStore.page.animate ? duration : 40

    await new Promise((resolve) => {
      setTimeout(resolve, d)
    })

    setReloadFlag(true)
  }

  const locale = ref<App.I18n.LangType>(localStg.get("lang") || "zh-CN")

  const localeOptions: App.I18n.LangOption[] = [
    {
      label: "中文",
      key: "zh-CN"
    },
    {
      label: "English",
      key: "en-US"
    }
  ]

  /**
   * 更改语言
   *
   * @param lang 语言类型
   */
  function changeLocale(lang: App.I18n.LangType) {
    locale.value = lang
    setLocale(lang)
    localStg.set("lang", lang)
  }

  /** 根据语言更新文档标题 */
  function updateDocumentTitleByLocale() {
    const { title } = router.currentRoute.value.meta

    useTitle(title)
  }

  function init() {
    setDayjsLocale(locale.value)
  }

  // 监听 store 变化
  scope.run(() => {
    // 监听 isMobile 状态，如果是移动端，折叠侧边栏
    watch(
      isMobile,
      (newValue) => {
        if (newValue) {
          // 在移动端之前备份主题设置
          localStg.set("backupThemeSettingBeforeIsMobile", {
            layout: themeStore.layout.mode,
            siderCollapse: siderCollapse.value
          })

          themeStore.setThemeLayout("vertical")
          setSiderCollapse(true)
        } else {
          // 当不再是移动端时，恢复备份的主题设置
          const backup = localStg.get("backupThemeSettingBeforeIsMobile")

          if (backup) {
            nextTick(() => {
              themeStore.setThemeLayout(backup.layout)
              setSiderCollapse(backup.siderCollapse)

              localStg.remove("backupThemeSettingBeforeIsMobile")
            })
          }
        }
      },
      { immediate: true }
    )

    // 监听 locale 变化
    watch(locale, () => {
      // 根据语言更新文档标题
      updateDocumentTitleByLocale()

      // 根据语言更新全局菜单
      routeStore.updateGlobalMenusByLocale()

      // 根据语言更新标签
      tabStore.updateTabsByLocale()

      // 设置 dayjs 语言
      setDayjsLocale(locale.value)
    })
  })

  // 缓存 mixSiderFixed 状态
  useEventListener(window, "beforeunload", () => {
    localStg.set("mixSiderFixed", mixSiderFixed.value ? "Y" : "N")
  })

  /** 组件销毁时 */
  onScopeDispose(() => {
    scope.stop()
  })

  // 初始化
  init()

  return {
    isMobile,
    reloadFlag,
    reloadPage,
    fullContent,
    locale,
    localeOptions,
    changeLocale,
    themeDrawerVisible,
    openThemeDrawer,
    closeThemeDrawer,
    toggleFullContent,
    contentXScrollable,
    setContentXScrollable,
    siderCollapse,
    setSiderCollapse,
    toggleSiderCollapse,
    mixSiderFixed,
    setMixSiderFixed,
    toggleMixSiderFixed
  }
})
