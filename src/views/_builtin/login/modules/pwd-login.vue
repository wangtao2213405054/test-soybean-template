<script setup lang="ts">
import { computed, reactive } from "vue"
import { loginModuleRecord } from "@/constants/app"
import { useRouterPush } from "@/hooks/common/router"
import { useFormRules, useNaiveForm } from "@/hooks/common/form"
import { useAuthStore } from "@/store/modules/auth"

defineOptions({
  name: "PwdLogin"
})

const authStore = useAuthStore()
const { toggleLoginModule } = useRouterPush()
const { formRef, validate } = useNaiveForm()

interface FormModel {
  userName: string
  password: string
}

const model: FormModel = reactive({
  userName: "admin@admin.com",
  password: "w123456"
})

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules } = useFormRules()

  return {
    userName: formRules.userName,
    password: formRules.password
  }
})

async function handleSubmit() {
  await validate()
  await authStore.login(model.userName, model.password)
}

type AccountKey = "super" | "admin" | "user"

interface Account {
  key: AccountKey
  label: string
  userName: string
  password: string
}

const accounts = computed<Account[]>(() => [
  {
    key: "super",
    label: "超级管理员",
    userName: "Super",
    password: "123456"
  },
  {
    key: "admin",
    label: "管理员",
    userName: "Admin",
    password: "123456"
  },
  {
    key: "user",
    label: "普通用户",
    userName: "User",
    password: "123456"
  }
])

async function handleAccountLogin(account: Account) {
  await authStore.login(account.userName, account.password)
}
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
    <NFormItem path="userName">
      <NInput v-model:value="model.userName" placeholder="请输入用户名" />
    </NFormItem>
    <NFormItem path="password">
      <NInput v-model:value="model.password" type="password" show-password-on="click" placeholder="请输入密码" />
    </NFormItem>
    <NSpace vertical :size="24">
      <div class="flex-y-center justify-between">
        <NCheckbox>记住我</NCheckbox>
        <NButton quaternary @click="toggleLoginModule('reset-pwd')">忘记密码？</NButton>
      </div>
      <NButton type="primary" size="large" round block :loading="authStore.loginLoading" @click="handleSubmit">
        确认
      </NButton>
      <div class="flex-y-center justify-between gap-12px">
        <NButton class="flex-1" block @click="toggleLoginModule('code-login')">
          {{ loginModuleRecord["code-login"] }}
        </NButton>
        <NButton class="flex-1" block @click="toggleLoginModule('register')">
          {{ loginModuleRecord.register }}
        </NButton>
      </div>
      <NDivider class="text-14px text-#666 !m-0">其他账号登录</NDivider>
      <div class="flex-center gap-12px">
        <NButton v-for="item in accounts" :key="item.key" type="primary" @click="handleAccountLogin(item)">
          {{ item.label }}
        </NButton>
      </div>
    </NSpace>
  </NForm>
</template>

<style scoped></style>
