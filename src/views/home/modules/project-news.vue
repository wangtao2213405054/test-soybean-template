<script setup lang="ts">
import { computed } from "vue"

defineOptions({
  name: "ProjectNews"
})

interface NewsItem {
  id: number
  content: string
  time: string
}

const newses = computed<NewsItem[]>(() => [
  { id: 1, content: "Soybean 在2021年5月28日创建了开源项目 soybean-admin!", time: "2021-05-28 22:22:22" },
  { id: 2, content: "Soybean 在2021年5月28日创建了开源项目 soybean-admin!", time: "2021-10-27 10:24:54" },
  { id: 3, content: "Soybean 在2021年5月28日创建了开源项目 soybean-admin!", time: "2021-10-31 22:43:12" },
  { id: 4, content: "Soybean 在2021年5月28日创建了开源项目 soybean-admin!", time: "2021-11-03 20:33:31" },
  { id: 5, content: "Soybean 在2021年5月28日创建了开源项目 soybean-admin!", time: "2021-11-07 22:45:32" }
])
</script>

<template>
  <NCard title="项目动态" :bordered="false" size="small" segmented class="card-wrapper">
    <template #header-extra>
      <a class="text-primary" href="javascript:">更多动态</a>
    </template>
    <NList>
      <NListItem v-for="item in newses" :key="item.id">
        <template #prefix>
          <SoybeanAvatar class="size-48px!" />
        </template>
        <NThing :title="item.content" :description="item.time" />
      </NListItem>
    </NList>
  </NCard>
</template>

<style scoped></style>
