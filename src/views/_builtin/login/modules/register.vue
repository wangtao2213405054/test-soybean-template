<script setup lang="ts">
import { computed, reactive } from "vue"
import { useRouterPush } from "@/hooks/common/router"
import { useFormRules, useNaiveForm } from "@/hooks/common/form"
import { useCaptcha } from "@/hooks/business/captcha"

defineOptions({
  name: "Register"
})

const { toggleLoginModule } = useRouterPush()
const { formRef, validate } = useNaiveForm()
const { label, isCounting, loading, getCaptcha } = useCaptcha()

interface FormModel {
  phone: string
  code: string
  password: string
  confirmPassword: string
}

const model: FormModel = reactive({
  phone: "",
  code: "",
  password: "",
  confirmPassword: ""
})

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  const { formRules, createConfirmPwdRule } = useFormRules()

  return {
    phone: formRules.phone,
    code: formRules.code,
    password: formRules.password,
    confirmPassword: createConfirmPwdRule(model.password)
  }
})

async function handleSubmit() {
  await validate()
  // request to register
  window.$message?.success("验证成功")
}
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
    <NFormItem path="phone">
      <NInput v-model:value="model.phone" placeholder="请输入手机号" />
    </NFormItem>
    <NFormItem path="code">
      <div class="w-full flex-y-center gap-16px">
        <NInput v-model:value="model.code" placeholder="请输入验证码" />
        <NButton size="large" :disabled="isCounting" :loading="loading" @click="getCaptcha(model.phone)">
          {{ label }}
        </NButton>
      </div>
    </NFormItem>
    <NFormItem path="password">
      <NInput v-model:value="model.password" type="password" show-password-on="click" placeholder="请输入密码" />
    </NFormItem>
    <NFormItem path="confirmPassword">
      <NInput
        v-model:value="model.confirmPassword"
        type="password"
        show-password-on="click"
        placeholder="请再次输入密码"
      />
    </NFormItem>
    <NSpace vertical :size="18" class="w-full">
      <NButton type="primary" size="large" round block @click="handleSubmit">确认</NButton>
      <NButton size="large" round block @click="toggleLoginModule('pwd-login')">返回</NButton>
    </NSpace>
  </NForm>
</template>

<style scoped></style>
