<script setup lang="ts">
import { computed } from "vue"
import type { Component } from "vue"
import { useAppStore } from "@/store/modules/app"
import { useThemeStore } from "@/store/modules/theme"
import type { RouterTypeToHomeProps } from "~/packages/materials"
import VerticalMenu from "./modules/vertical-menu.vue"
import VerticalMixMenu from "./modules/vertical-mix-menu.vue"
import HorizontalMenu from "./modules/horizontal-menu.vue"
import HorizontalMixMenu from "./modules/horizontal-mix-menu.vue"
import ReversedHorizontalMixMenu from "./modules/reversed-horizontal-mix-menu.vue"

defineOptions({
  name: "GlobalMenu"
})

const props = defineProps<RouterTypeToHomeProps>()

const appStore = useAppStore()
const themeStore = useThemeStore()

const activeMenu = computed(() => {
  const menuMap: Record<UnionKey.ThemeLayoutMode, Component> = {
    vertical: VerticalMenu,
    "vertical-mix": VerticalMixMenu,
    horizontal: HorizontalMenu,
    "horizontal-mix": themeStore.layout.reverseHorizontalMix ? ReversedHorizontalMixMenu : HorizontalMixMenu
  }

  return menuMap[props.layoutMode || themeStore.layout.mode]
})

const reRenderVertical = computed(
  () => (props.layoutMode || themeStore.layout.mode) === "vertical" && appStore.isMobile
)
</script>

<template>
  <component :is="activeMenu" :key="reRenderVertical" />
</template>

<style scoped></style>
