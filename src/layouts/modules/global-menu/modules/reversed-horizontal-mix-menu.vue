<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useRoute } from "vue-router"
import type { RouteKey } from "@elegant-router/types"
import { type RouterTypeToHomeProps, SimpleScrollbar } from "@sa/materials"
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from "@/constants/app"
import { useAppStore } from "@/store/modules/app"
import { useThemeStore } from "@/store/modules/theme"
import { useRouteStore } from "@/store/modules/route"
import { useRouterPush } from "@/hooks/common/router"
import { useMixMenuContext } from "../../../context"

defineOptions({
  name: "ReversedHorizontalMixMenu"
})

const props = withDefaults(defineProps<RouterTypeToHomeProps>(), {
  layoutMode: undefined
})

const route = useRoute()
const appStore = useAppStore()
const themeStore = useThemeStore()
const routeStore = useRouteStore()
const {
  firstLevelMenus,
  childLevelMenus,
  activeFirstLevelMenuKey,
  setActiveFirstLevelMenuKey,
  isActiveFirstLevelMenuHasChildren
} = useMixMenuContext()
const { routerPushByKeyWithMetaQuery } = useRouterPush()

const selectedKey = computed(() => {
  const { hideInMenu, activeMenu } = route.meta
  const name = route.name as string

  return (hideInMenu ? activeMenu : name) || name
})

function handleSelectMixMenu(key: RouteKey) {
  setActiveFirstLevelMenuKey(key)

  if (!isActiveFirstLevelMenuHasChildren.value) {
    routerPushByKeyWithMetaQuery(key)
  }
}

const expandedKeys = ref<string[]>([])

function updateExpandedKeys() {
  if (appStore.siderCollapse || !selectedKey.value) {
    expandedKeys.value = []
    return
  }
  expandedKeys.value = routeStore.getSelectedMenuKeyPath(selectedKey.value)
}

watch(
  () => route.name,
  () => {
    updateExpandedKeys()
  },
  { immediate: true }
)

const menu = computed(() => firstLevelMenus.value.filter((item) => (props.layoutMode ? item.homepage : !item.homepage)))
const childMenus = computed(() =>
  childLevelMenus.value.filter((item) => (props.layoutMode ? item.homepage : !item.homepage))
)
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <NMenu
      mode="horizontal"
      :value="activeFirstLevelMenuKey"
      :options="menu"
      :indent="18"
      responsive
      @update:value="handleSelectMixMenu"
    />
  </Teleport>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <SimpleScrollbar>
      <NMenu
        v-model:expanded-keys="expandedKeys"
        mode="vertical"
        :value="selectedKey"
        :collapsed="appStore.siderCollapse"
        :collapsed-width="themeStore.sider.collapsedWidth"
        :collapsed-icon-size="22"
        :options="childMenus"
        :indent="18"
        @update:value="routerPushByKeyWithMetaQuery"
      />
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
