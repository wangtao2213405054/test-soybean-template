import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { useEventListener } from "@vueuse/core"
import type { RouteKey } from "@elegant-router/types"
import { router } from "@/router"
import { SetupStoreId } from "@/enum"
import { useRouterPush } from "@/hooks/common/router"
import { localStg } from "@/utils/storage"
import { useRouteStore } from "@/store/modules/route"
import { useThemeStore } from "../theme"
import {
  extractTabsByAllRoutes,
  filterTabsById,
  filterTabsByIds,
  findTabByRouteName,
  getAllTabs,
  getDefaultHomeTab,
  getFixedTabIds,
  getTabByRoute,
  getTabIdByRoute,
  isTabInTabs,
  updateTabByI18nKey,
  updateTabsByI18nKey
} from "./shared"

export const useTabStore = defineStore(SetupStoreId.Tab, () => {
  const routeStore = useRouteStore()
  const themeStore = useThemeStore()
  const { routerPush } = useRouterPush(false)

  /** Tabs 列表 */
  const tabs = ref<App.Global.Tab[]>([])

  /** 获取活跃的 tab */
  const homeTab = ref<App.Global.Tab>()

  /** 初始化首页 tab */
  function initHomeTab() {
    homeTab.value = getDefaultHomeTab(router, routeStore.routeHome)
  }

  /** 获取所有 tab */
  const allTabs = computed(() => getAllTabs(tabs.value, homeTab.value))

  /** 活跃的 tab id */
  const activeTabId = ref<string>("")

  /**
   * 设置活跃的 tab id
   *
   * @param id Tab id
   */
  function setActiveTabId(id: string) {
    activeTabId.value = id
  }

  /**
   * 初始化 tab store
   *
   * @param currentRoute 当前路由
   */
  function initTabStore(currentRoute: App.Global.TabRoute) {
    const storageTabs = localStg.get("globalTabs")

    if (themeStore.tab.cache && storageTabs) {
      const extractedTabs = extractTabsByAllRoutes(router, storageTabs)
      tabs.value = updateTabsByI18nKey(extractedTabs)
    }

    addTab(currentRoute)
  }

  /**
   * 添加 tab
   *
   * @param route Tab 路由
   * @param active 是否激活添加的 tab
   */
  function addTab(route: App.Global.TabRoute, active = true) {
    const tab = getTabByRoute(route)

    const isHomeTab = tab.id === homeTab.value?.id

    if (!isHomeTab && !isTabInTabs(tab.id, tabs.value)) {
      tabs.value.push(tab)
    }

    if (active) {
      setActiveTabId(tab.id)
    }
  }

  /**
   * 移除 tab
   *
   * @param tabId Tab id
   */
  async function removeTab(tabId: string) {
    const isRemoveActiveTab = activeTabId.value === tabId
    const updatedTabs = filterTabsById(tabId, tabs.value)

    function update() {
      tabs.value = updatedTabs
    }

    if (!isRemoveActiveTab) {
      update()
      return
    }

    const activeTab = updatedTabs.at(-1) || homeTab.value

    if (activeTab) {
      await switchRouteByTab(activeTab)
      update()
    }
  }

  /** 移除活跃的 tab */
  async function removeActiveTab() {
    await removeTab(activeTabId.value)
  }

  /**
   * 根据路由名称移除 tab
   *
   * @param routeName 路由名称
   */
  async function removeTabByRouteName(routeName: RouteKey) {
    const tab = findTabByRouteName(routeName, tabs.value)
    if (!tab) return

    await removeTab(tab.id)
  }

  /**
   * 清除所有 tab
   *
   * @param excludes 排除的 tab ids
   */
  async function clearTabs(excludes: string[] = []) {
    const remainTabIds = [...getFixedTabIds(tabs.value), ...excludes]
    const removedTabsIds = tabs.value.map((tab) => tab.id).filter((id) => !remainTabIds.includes(id))

    const isRemoveActiveTab = removedTabsIds.includes(activeTabId.value)
    const updatedTabs = filterTabsByIds(removedTabsIds, tabs.value)

    function update() {
      tabs.value = updatedTabs
    }

    if (!isRemoveActiveTab) {
      update()
      return
    }

    const activeTab = updatedTabs[updatedTabs.length - 1] || homeTab.value

    await switchRouteByTab(activeTab)
    update()
  }

  /**
   * 根据 tab 切换路由
   *
   * @param tab
   */
  async function switchRouteByTab(tab: App.Global.Tab) {
    const fail = await routerPush(tab.fullPath)
    if (!fail) {
      setActiveTabId(tab.id)
    }
  }

  /**
   * 清除左侧 tab
   *
   * @param tabId
   */
  async function clearLeftTabs(tabId: string) {
    const tabIds = tabs.value.map((tab) => tab.id)
    const index = tabIds.indexOf(tabId)
    if (index === -1) return

    const excludes = tabIds.slice(index)
    await clearTabs(excludes)
  }

  /**
   * 清除右侧 tab
   *
   * @param tabId
   */
  async function clearRightTabs(tabId: string) {
    const isHomeTab = tabId === homeTab.value?.id
    if (isHomeTab) {
      await clearTabs()
      return
    }

    const tabIds = tabs.value.map((tab) => tab.id)
    const index = tabIds.indexOf(tabId)
    if (index === -1) return

    const excludes = tabIds.slice(0, index + 1)
    await clearTabs(excludes)
  }

  /**
   * 设置 tab 新标签
   *
   * @default activeTabId
   * @param label 新 tab 标签
   * @param tabId Tab id
   */
  function setTabLabel(label: string, tabId?: string) {
    const id = tabId || activeTabId.value

    const tab = tabs.value.find((item) => item.id === id)
    if (!tab) return

    tab.oldLabel = tab.label
    tab.newLabel = label
  }

  /**
   * 重置 tab 标签
   *
   * @default activeTabId
   * @param tabId Tab id
   */
  function resetTabLabel(tabId?: string) {
    const id = tabId || activeTabId.value

    const tab = tabs.value.find((item) => item.id === id)
    if (!tab) return

    tab.newLabel = undefined
  }

  /**
   * 判断 tab 是否被保留
   *
   * @param tabId
   */
  function isTabRetain(tabId: string) {
    if (tabId === homeTab.value?.id) return true

    const fixedTabIds = getFixedTabIds(tabs.value)

    return fixedTabIds.includes(tabId)
  }

  /** 更新 tabs 语言环境 */
  function updateTabsByLocale() {
    tabs.value = updateTabsByI18nKey(tabs.value)

    if (homeTab.value) {
      homeTab.value = updateTabByI18nKey(homeTab.value)
    }
  }

  /** 缓存 tabs */
  function cacheTabs() {
    if (!themeStore.tab.cache) return

    localStg.set("globalTabs", tabs.value)
  }

  // 当页面关闭或刷新时缓存 tabs
  useEventListener(window, "beforeunload", () => {
    cacheTabs()
  })

  return {
    /** 所有 tabs */
    tabs: allTabs,
    activeTabId,
    initHomeTab,
    initTabStore,
    addTab,
    removeTab,
    removeActiveTab,
    removeTabByRouteName,
    clearTabs,
    clearLeftTabs,
    clearRightTabs,
    switchRouteByTab,
    setTabLabel,
    resetTabLabel,
    isTabRetain,
    updateTabsByLocale,
    getTabIdByRoute,
    cacheTabs
  }
})
