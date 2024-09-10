<script setup lang="ts">
import { shallowRef, watch } from "vue"
import { fetchGetAllPages, fetchGetMenuTree } from "@/service/api"

defineOptions({
  name: "MenuAuthModal"
})

interface Props {
  /** the roleId */
  roleId: number
}

const props = defineProps<Props>()

const visible = defineModel<boolean>("visible", {
  default: false
})

function closeModal() {
  visible.value = false
}

const pages = shallowRef<string[]>([])

async function getPages() {
  const { error, data } = await fetchGetAllPages()

  if (!error) {
    pages.value = data
  }
}

const tree = shallowRef<SystemManage.MenuTree[]>([])

async function getTree() {
  const { error, data } = await fetchGetMenuTree()

  if (!error) {
    tree.value = data
  }
}

const checks = shallowRef<number[]>([])

async function getChecks() {
  console.log(props.roleId)
  // request
  checks.value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
}

function handleSubmit() {
  console.log(checks.value, props.roleId)
  // request

  window.$message?.success?.("修改成功")

  closeModal()
}

function init() {
  getPages()
  getTree()
  getChecks()
}

watch(visible, (val) => {
  if (val) {
    init()
  }
})
</script>

<template>
  <NModal v-model:show="visible" title="编辑菜单权限" preset="card" class="w-480px">
    <NTree
      v-model:checked-keys="checks"
      :data="tree"
      key-field="id"
      label-field="menuName"
      checkable
      expand-on-click
      virtual-scroll
      block-line
      class="h-280px"
    />
    <template #footer>
      <NSpace justify="end">
        <NButton size="small" class="mt-16px" @click="closeModal">取消</NButton>
        <NButton type="primary" size="small" class="mt-16px" @click="handleSubmit">确认</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
