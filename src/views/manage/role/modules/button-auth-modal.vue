<script setup lang="ts">
import { shallowRef, watch } from "vue"
import { editRolePermissionInfo, getPermissionMenuList } from "@/service/api"

defineOptions({
  name: "ButtonAuthModal"
})

interface Props {
  /** the roleId */
  roleId: number
  type: SystemManage.MenuPermissionType
  checked?: string[]
}

const props = defineProps<Props>()

interface Emits {
  (e: "submitted", role: SystemManage.Role): void
}

const emit = defineEmits<Emits>()

const visible = defineModel<boolean>("visible", {
  default: false
})

function closeModal() {
  visible.value = false
}

const tree = shallowRef<SystemManage.MenuPermission[]>([])

async function getAllButtons() {
  // request
  const { data } = await getPermissionMenuList(props.type)
  tree.value = data || []
}

const checks = shallowRef<string[]>([])

function getChecks() {
  checks.value = props.checked || []
}

async function handleSubmit() {
  const body: SystemManage.RoleUpdatePermission = {
    id: props.roleId
  }

  if (props.type === "buttons") {
    body.buttonCodes = checks.value
  }

  if (props.type === "interfaces") {
    body.interfaceCodes = checks.value
  }

  const { error, data } = await editRolePermissionInfo(body)

  if (!error) {
    window.$message?.success?.("修改成功")
    emit("submitted", data)
    closeModal()
  }
}

function init() {
  getAllButtons()
  getChecks()
}

watch(visible, (val) => {
  if (val) {
    init()
  }
})
</script>

<template>
  <NModal v-model:show="visible" title="编辑按钮权限" preset="card" class="w-480px">
    <NTree
      v-model:checked-keys="checks"
      :data="tree"
      key-field="code"
      label-field="description"
      block-line
      checkable
      expand-on-click
      virtual-scroll
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
