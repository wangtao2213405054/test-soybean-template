<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import { GLOBAL_HEADER_MENU_ID } from "@/constants/app"
import { useRouteStore } from "@/store/modules/route"
import { useRouterPush } from "@/hooks/common/router"
import type { RouterTypeToHomeProps } from "~/packages/materials"

defineOptions({
  name: "HorizontalMenu"
})

const props = withDefaults(defineProps<RouterTypeToHomeProps>(), {
  layoutMode: undefined
})

const route = useRoute()
const routeStore = useRouteStore()
const { routerPushByKeyWithMetaQuery } = useRouterPush()

const selectedKey = computed(() => {
  const { hideInMenu, activeMenu } = route.meta
  const name = route.name as string

  return (hideInMenu ? activeMenu : name) || name
})

const menu = computed(() => routeStore.menus.filter((item) => (props.layoutMode ? item.homepage : !item.homepage)))
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <NMenu
      mode="horizontal"
      :value="selectedKey"
      :options="menu"
      :indent="18"
      responsive
      @update:value="routerPushByKeyWithMetaQuery"
    />
  </Teleport>
</template>

<style scoped></style>
