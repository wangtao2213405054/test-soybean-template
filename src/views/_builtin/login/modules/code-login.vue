<script setup lang="ts">
import { computed, reactive } from "vue"
import { useRouterPush } from "@/hooks/common/router"
import { useFormRules, useNaiveForm } from "@/hooks/common/form"
import { useCaptcha } from "@/hooks/business/captcha"

defineOptions({
  name: "CodeLogin"
})

const { toggleLoginModule } = useRouterPush()
const { formRef, validate } = useNaiveForm()
const { label, isCounting, loading, getCaptcha } = useCaptcha()

interface FormModel {
  phone: string
  code: string
}

const model: FormModel = reactive({
  phone: "",
  code: ""
})

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  const { formRules } = useFormRules()

  return {
    phone: formRules.phone,
    code: formRules.code
  }
})

async function handleSubmit() {
  await validate()
  // request
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
    <NSpace vertical :size="18" class="w-full">
      <NButton type="primary" size="large" round block @click="handleSubmit">确认</NButton>
      <NButton size="large" round block @click="toggleLoginModule('pwd-login')">返回</NButton>
    </NSpace>
  </NForm>
</template>

<style scoped></style>
