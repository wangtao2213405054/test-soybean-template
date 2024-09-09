<script setup lang="ts">
import { computed } from "vue"
import { useAppStore } from "@/store/modules/app"
import HeaderBanner from "./modules/header-banner.vue"
import CardData from "./modules/card-data.vue"
import LineChart from "./modules/line-chart.vue"
import PieChart from "./modules/pie-chart.vue"
import ProjectNews from "./modules/project-news.vue"
import CreativityBanner from "./modules/creativity-banner.vue"

const appStore = useAppStore()

const gap = computed(() => (appStore.isMobile ? 0 : 16))
</script>

<template>
  <NSpace vertical :size="16">
    <NAlert title="警告" type="warning">
      为了方便大家开发和更新合并，我们对main分支的代码进行了精简，只保留了首页菜单，其余内容已移至example分支进行维护。预览地址显示的内容即为example分支的内容。
    </NAlert>
    <HeaderBanner />
    <CardData />
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <NCard :bordered="false" class="card-wrapper">
          <LineChart />
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:10">
        <NCard :bordered="false" class="card-wrapper">
          <PieChart />
        </NCard>
      </NGi>
    </NGrid>
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <ProjectNews />
      </NGi>
      <NGi span="24 s:24 m:10">
        <CreativityBanner />
      </NGi>
    </NGrid>
  </NSpace>
</template>

<style scoped></style>
