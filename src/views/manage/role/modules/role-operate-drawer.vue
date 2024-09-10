<script setup lang="ts">
import { computed, reactive, watch } from "vue"
import { useBoolean } from "@sa/hooks"
import { useFormRules, useNaiveForm } from "@/hooks/common/form"
import { enableStatusOptions } from "@/constants/business"
import { editRoleInfo } from "@/service/api"
import MenuAuthModal from "./menu-auth-modal.vue"
import ButtonAuthModal from "./button-auth-modal.vue"

defineOptions({
  name: "RoleOperateDrawer"
})

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType
  /** the edit row data */
  rowData?: SystemManage.Role | null
}

const props = defineProps<Props>()

interface Emits {
  (e: "submitted"): void
}

const emit = defineEmits<Emits>()

const visible = defineModel<boolean>("visible", {
  default: false
})

const { formRef, validate, restoreValidation } = useNaiveForm()
const { defaultRequiredRule } = useFormRules()
const { bool: menuAuthVisible, setTrue: openMenuAuthModal } = useBoolean()
const { bool: buttonAuthVisible, setTrue: openButtonAuthModal } = useBoolean()

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: "新增角色",
    edit: "编辑角色"
  }
  return titles[props.operateType]
})

type Model = Pick<SystemManage.Role, "name" | "describe" | "status">

const model: Model = reactive(createDefaultModel())

function createDefaultModel(): Model {
  return {
    name: "",
    describe: "",
    status: true
  }
}

type RuleKey = Exclude<keyof Model, "describe">

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule,
  status: defaultRequiredRule
}

const roleId = computed(() => props.rowData?.id || -1)

const isEdit = computed(() => props.operateType === "edit")

function handleInitModel() {
  Object.assign(model, createDefaultModel())

  if (props.operateType === "edit" && props.rowData) {
    Object.assign(model, props.rowData)
  }
}

function closeDrawer() {
  visible.value = false
}

async function handleSubmit() {
  await validate()
  const { error } = await editRoleInfo(model)
  if (!error) {
    window.$message?.success("更新成功")
    closeDrawer()
    emit("submitted")
  }
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel()
    restoreValidation()
  }
})
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem label="角色名称" path="roleName">
          <NInput v-model:value="model.name" placeholder="请输入角色名称" />
        </NFormItem>
        <NFormItem label="角色状态" path="status">
          <NRadioGroup v-model:value="model.status">
            <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="item.label" />
          </NRadioGroup>
        </NFormItem>
        <NFormItem label="角色描述" path="roleDesc">
          <NInput v-model:value="model.describe" placeholder="请输入角色描述" />
        </NFormItem>
      </NForm>
      <NSpace v-if="isEdit">
        <NButton @click="openMenuAuthModal">菜单权限</NButton>
        <MenuAuthModal v-model:visible="menuAuthVisible" :role-id="roleId" />
        <NButton @click="openButtonAuthModal">按钮权限</NButton>
        <ButtonAuthModal v-model:visible="buttonAuthVisible" :role-id="roleId" />
      </NSpace>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">取消</NButton>
          <NButton type="primary" @click="handleSubmit">确认</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
