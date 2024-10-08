<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useRoute } from "vue-router"
import { type RouterTypeToHomeProps, SimpleScrollbar } from "@sa/materials"
import { useAppStore } from "@/store/modules/app"
import { useThemeStore } from "@/store/modules/theme"
import { useRouteStore } from "@/store/modules/route"
import { useRouterPush } from "@/hooks/common/router"
import { GLOBAL_SIDER_MENU_ID } from "@/constants/app"

defineOptions({
  name: "VerticalMenu"
})

const props = withDefaults(defineProps<RouterTypeToHomeProps>(), {
  layoutMode: undefined
})

const route = useRoute()
const appStore = useAppStore()
const themeStore = useThemeStore()
const routeStore = useRouteStore()
const { routerPushByKeyWithMetaQuery } = useRouterPush()

const inverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted)

const selectedKey = computed(() => {
  const { hideInMenu, activeMenu } = route.meta
  const name = route.name as string

  return (hideInMenu ? activeMenu : name) || name
})

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

const menu = computed(() => routeStore.menus.filter((item) => (props.layoutMode ? item.homepage : !item.homepage)))
</script>

<template>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <SimpleScrollbar>
      <NMenu
        v-model:expanded-keys="expandedKeys"
        mode="vertical"
        :value="selectedKey"
        :collapsed="appStore.siderCollapse"
        :collapsed-width="themeStore.sider.collapsedWidth"
        :collapsed-icon-size="22"
        :options="menu"
        :inverted="inverted"
        :indent="18"
        @update:value="routerPushByKeyWithMetaQuery"
      />
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
