<script setup lang="ts">
import { enableStatusOptions } from "@/constants/business"

defineOptions({
  name: "RoleSearch"
})

interface Emits {
  (e: "reset"): void
  (e: "search"): void
}

const emit = defineEmits<Emits>()

const model = defineModel<SystemManage.RoleSearchParams>("model", { required: true })

function reset() {
  emit("reset")
}

function search() {
  emit("search")
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse :default-expanded-names="['role-search']">
      <NCollapseItem title="搜索" name="role-search">
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" label="关键字" path="roleName" class="pr-24px">
              <NInput v-model:value="model.keyword" placeholder="输入关键字查询" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="角色状态" path="status" class="pr-24px">
              <NSelect
                v-model:value="model.status"
                placeholder="请选择角色状态"
                :options="enableStatusOptions"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6">
              <NSpace class="w-full" justify="end">
                <NButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  重置
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  搜索
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped></style>
