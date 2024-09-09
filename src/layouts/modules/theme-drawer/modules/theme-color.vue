<script setup lang="ts">
import { useThemeStore } from "@/store/modules/theme"
import SettingItem from "../components/setting-item.vue"

defineOptions({
  name: "ThemeColor"
})

const themeStore = useThemeStore()

function handleUpdateColor(color: string, key: App.Theme.ThemeColorKey) {
  themeStore.updateThemeColors(key, color)
}

const swatches: string[] = [
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#0ea5e9",
  "#06b6d4",
  "#f43f5e",
  "#ef4444",
  "#ec4899",
  "#d946ef",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981"
]
const themeColor = {
  primary: "主色",
  info: "信息色",
  success: "成功色",
  warning: "警告色",
  error: "错误色"
}
</script>

<template>
  <NDivider>主题颜色</NDivider>
  <div class="flex-col-stretch gap-12px">
    <NTooltip placement="top-start">
      <template #trigger>
        <SettingItem key="recommend-color" label="应用推荐算法的颜色">
          <NSwitch v-model:value="themeStore.recommendColor" />
        </SettingItem>
      </template>
      <p>
        <span class="pr-12px">推荐颜色的算法参照</span>
        <br />
        <NButton
          text
          tag="a"
          href="https://uicolors.app/create"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray"
        >
          https://uicolors.app/create
        </NButton>
      </p>
    </NTooltip>
    <SettingItem v-for="(_, key) in themeStore.themeColors" :key="key" :label="themeColor[key]">
      <template v-if="key === 'info'" #suffix>
        <NCheckbox v-model:checked="themeStore.isInfoFollowPrimary">跟随主色</NCheckbox>
      </template>
      <NColorPicker
        class="w-90px"
        :value="themeStore.themeColors[key]"
        :disabled="key === 'info' && themeStore.isInfoFollowPrimary"
        :show-alpha="false"
        :swatches="swatches"
        @update:value="handleUpdateColor($event, key)"
      />
    </SettingItem>
  </div>
</template>

<style scoped></style>
