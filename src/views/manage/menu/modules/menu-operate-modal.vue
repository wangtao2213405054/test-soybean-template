<script setup lang="tsx">
import { computed, reactive, watch } from "vue"
import type { SelectOption } from "naive-ui"
import { useFormRules, useNaiveForm } from "@/hooks/common/form"
import { menuIconTypeOptions, menuTypeOptions } from "@/constants/business"
import SvgIcon from "@/components/custom/svg-icon.vue"
import { getLocalIcons } from "@/utils/icon"
import { editMenuInfo } from "@/service/api"
import {
  getLayoutAndPage,
  getPathParamFromRoutePath,
  getRoutePathByRouteName,
  getRoutePathWithParam,
  transformLayoutAndPageToComponent
} from "./shared"

defineOptions({
  name: "MenuOperateModal"
})

export type OperateType = NaiveUI.TableOperateType | "addChild"

interface Props {
  /** the type of operation */
  operateType: OperateType
  /** the edit menu data or the parent menu data when adding a child menu */
  rowData?: SystemManage.Menu | null
  /** all pages */
  allPages: string[]
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

const title = computed(() => {
  const titles: Record<OperateType, string> = {
    add: "新增菜单",
    addChild: "新增子菜单",
    edit: "编辑菜单"
  }
  return titles[props.operateType]
})

type Model = Pick<
  SystemManage.Menu,
  | "menuType"
  | "menuName"
  | "routeName"
  | "routePath"
  | "component"
  | "order"
  | "i18nKey"
  | "icon"
  | "iconType"
  | "status"
  | "nodeId"
  | "keepAlive"
  | "constant"
  | "href"
  | "hideInMenu"
  | "activeMenu"
  | "multiTab"
  | "fixedIndexInTab"
  | "homepage"
> & {
  query: NonNullable<SystemManage.Menu["query"]>
  buttons: NonNullable<SystemManage.Menu["buttons"]>
  interfaces: NonNullable<SystemManage.Menu["interfaces"]>
  layout: string
  page: string
  pathParam: string
}

const model: Model = reactive(createDefaultModel())

function createDefaultModel(): Model {
  return {
    menuType: 1,
    menuName: "",
    routeName: "",
    routePath: "",
    pathParam: "",
    component: "",
    layout: "",
    page: "",
    i18nKey: null,
    icon: "",
    iconType: 1,
    nodeId: 0,
    status: true,
    keepAlive: false,
    constant: false,
    order: 0,
    href: null,
    hideInMenu: false,
    activeMenu: null,
    multiTab: false,
    fixedIndexInTab: null,
    homepage: false,
    query: [],
    buttons: [],
    interfaces: []
  }
}

type RuleKey = Extract<keyof Model, "menuName" | "status" | "routeName" | "routePath">

const rules: Record<RuleKey, App.Global.FormRule> = {
  menuName: defaultRequiredRule,
  status: defaultRequiredRule,
  routeName: defaultRequiredRule,
  routePath: defaultRequiredRule
}

const disabledMenuType = computed(() => props.operateType === "edit")

const localIcons = getLocalIcons()
const localIconOptions = localIcons.map<SelectOption>((item) => ({
  label: () => (
    <div class="flex-y-center gap-16px">
      <SvgIcon localIcon={item} class="text-icon" />
      <span>{item}</span>
    </div>
  ),
  value: item
}))

const showLayout = computed(() => model.nodeId === 0)

const showPage = computed(() => model.menuType === 2)

const pageOptions = computed(() => {
  const allPages = [...props.allPages]

  if (model.routeName && !allPages.includes(model.routeName)) {
    allPages.unshift(model.routeName)
  }

  const opts: CommonType.Option[] = allPages.map((page) => ({
    label: page,
    value: page
  }))

  return opts
})

const layoutOptions: CommonType.Option[] = [
  {
    label: "base",
    value: "base"
  },
  {
    label: "blank",
    value: "blank"
  },
  {
    label: "home",
    value: "home"
  }
]

/** 初始化 model 对象 */
function handleInitModel() {
  Object.assign(model, createDefaultModel())

  if (!props.rowData) return

  if (props.operateType === "addChild") {
    const { id, routeName } = props.rowData
    Object.assign(model, {
      nodeId: id,
      routeName: `${routeName}_`,
      routePath: `${getRoutePathByRouteName(routeName)}/`
    })
  }

  if (props.operateType === "edit") {
    const { component, ...rest } = props.rowData
    const { layout, page } = getLayoutAndPage(component)
    const { path, param } = getPathParamFromRoutePath(rest.routePath)

    Object.assign(model, rest, { layout, page, routePath: path, pathParam: param })
  }

  if (!model.query) {
    model.query = []
  }
  if (!model.buttons) {
    model.buttons = []
  }
}

/** 关闭抽屉 */
function closeDrawer() {
  visible.value = false
}

/** 根据 routeName 更新 routePath */
function handleUpdateRoutePathByRouteName() {
  if (model.routeName) {
    model.routePath = getRoutePathByRouteName(model.routeName)
  } else {
    model.routePath = ""
  }
}

/** 根据布局内容更新 homepage */
function handleUpdateRouteHomepage() {
  model.homepage = model.layout === "home"
}

/**
 * 创建权限项
 *
 * @returns {SystemManage.MenuPermission} 新的权限项
 */
function handleCreatePermission(): SystemManage.MenuPermission {
  return {
    code: "",
    description: ""
  }
}

/** 获取提交参数 */
function getSubmitParams() {
  const { layout, page, pathParam, ...params } = model

  const component = transformLayoutAndPageToComponent(layout, page)
  const routePath = getRoutePathWithParam(model.routePath, pathParam)

  params.component = component
  params.routePath = routePath

  return params
}

/** 提交表单 */
async function handleSubmit() {
  await validate()

  const params = getSubmitParams()
  const { error } = await editMenuInfo(params)

  if (!error) {
    window.$message?.success("更新成功")
    closeDrawer()
    emit("submitted")
  }
}

/** 监听 visible 的变化，当抽屉显示时初始化 model */
watch(visible, () => {
  if (visible.value) {
    handleInitModel()
    restoreValidation()
  }
})

/** 监听 routeName 的变化，自动更新 routePath 和 i18nKey */
watch(
  () => model.routeName,
  () => {
    handleUpdateRoutePathByRouteName()
  }
)

/** 监听 layout 的变化，自动更新 homepage */
watch(
  () => model.layout,
  () => {
    handleUpdateRouteHomepage()
  }
)
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-800px">
    <NScrollbar class="h-480px pr-20px">
      <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="100">
        <NGrid responsive="screen" item-responsive>
          <NFormItemGi span="24 m:12" label="菜单类型" path="menuType">
            <NRadioGroup v-model:value="model.menuType" :disabled="disabledMenuType">
              <NRadio v-for="item in menuTypeOptions" :key="item.value" :value="item.value" :label="item.label" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" label="菜单名称" path="menuName">
            <NInput v-model:value="model.menuName" placeholder="请输入菜单名称" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" label="路由名称" path="routeName">
            <NInput v-model:value="model.routeName" placeholder="请输入路由名称" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" label="路由路径" path="routePath">
            <NInput v-model:value="model.routePath" disabled placeholder="请输入路由路径" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" label="路径参数" path="pathParam">
            <NInput v-model:value="model.pathParam" placeholder="请输入路径参数" />
          </NFormItemGi>
          <NFormItemGi v-if="showLayout" span="24 m:12" label="布局" path="layout">
            <NSelect v-model:value="model.layout" :options="layoutOptions" placeholder="请选择布局组件" />
          </NFormItemGi>
          <NFormItemGi v-if="showPage" span="24 m:12" label="页面组件" path="page">
            <NSelect v-model:value="model.page" :options="pageOptions" placeholder="请选择页面组件" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" label="排序" path="order">
            <NInputNumber v-model:value="model.order" class="w-full" placeholder="请输入排序" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" label="图标类型" path="iconType">
            <NRadioGroup v-model:value="model.iconType">
              <NRadio v-for="item in menuIconTypeOptions" :key="item.value" :value="item.value" :label="item.label" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" label="图标" path="icon">
            <template v-if="model.iconType === 1">
              <NInput v-model:value="model.icon" placeholder="请输入图标" class="flex-1">
                <template #suffix>
                  <SvgIcon v-if="model.icon" :icon="model.icon" class="text-icon" />
                </template>
              </NInput>
            </template>
            <template v-if="model.iconType === 2">
              <NSelect v-model:value="model.icon" placeholder="请选择本地图标" :options="localIconOptions" />
            </template>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" label="菜单状态" path="status">
            <NRadioGroup v-model:value="model.status">
              <NRadio :value="true" label="启用" />
              <NRadio :value="false" label="禁用" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" label="缓存路由" path="keepAlive">
            <NRadioGroup v-model:value="model.keepAlive">
              <NRadio :value="true" label="是" />
              <NRadio :value="false" label="否" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" label="常量路由" path="constant">
            <NRadioGroup v-model:value="model.constant">
              <NRadio :value="true" label="是" />
              <NRadio :value="false" label="否" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" label="外链" path="href">
            <NInput v-model:value="model.href" placeholder="请输入外链" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" label="隐藏菜单" path="hideInMenu">
            <NRadioGroup v-model:value="model.hideInMenu">
              <NRadio :value="true" label="是" />
              <NRadio :value="false" label="否" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi v-if="model.hideInMenu" span="24 m:12" label="高亮的菜单" path="activeMenu">
            <NSelect
              v-model:value="model.activeMenu"
              :options="pageOptions"
              clearable
              placeholder="请选择高亮的菜单的路由名称"
            />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" label="支持多页签" path="multiTab">
            <NRadioGroup v-model:value="model.multiTab">
              <NRadio :value="true" label="是" />
              <NRadio :value="false" label="否" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" label="固定在页签中的序号" path="fixedIndexInTab">
            <NInputNumber
              v-model:value="model.fixedIndexInTab"
              class="w-full"
              clearable
              placeholder="请输入固定在页签中的序号"
            />
          </NFormItemGi>
          <NFormItemGi span="24" label="路由参数">
            <NDynamicInput
              v-model:value="model.query"
              preset="pair"
              key-placeholder="请输入路由参数Key"
              value-placeholder="请输入路由参数Value"
            >
              <template #action="{ index, create, remove }">
                <NSpace class="ml-12px">
                  <NButton size="medium" @click="() => create(index)">
                    <icon-ic-round-plus class="text-icon" />
                  </NButton>
                  <NButton size="medium" @click="() => remove(index)">
                    <icon-ic-round-remove class="text-icon" />
                  </NButton>
                </NSpace>
              </template>
            </NDynamicInput>
          </NFormItemGi>
          <NFormItemGi span="24" label="按钮">
            <NDynamicInput v-model:value="model.buttons" :on-create="handleCreatePermission">
              <template #default="{ value }">
                <div class="ml-8px flex-y-center flex-1 gap-12px">
                  <NInput v-model:value="value['code']" placeholder="请输入按钮编码" class="flex-1" />
                  <NInput v-model:value="value['description']" placeholder="请输入按钮描述" class="flex-1" />
                </div>
              </template>
              <template #action="{ index, create, remove }">
                <NSpace class="ml-12px">
                  <NButton size="medium" @click="() => create(index)">
                    <icon-ic-round-plus class="text-icon" />
                  </NButton>
                  <NButton size="medium" @click="() => remove(index)">
                    <icon-ic-round-remove class="text-icon" />
                  </NButton>
                </NSpace>
              </template>
            </NDynamicInput>
          </NFormItemGi>
          <NFormItemGi span="24" label="接口">
            <NDynamicInput v-model:value="model.interfaces" :on-create="handleCreatePermission">
              <template #default="{ value }">
                <div class="ml-8px flex-y-center flex-1 gap-12px">
                  <NInput v-model:value="value['code']" placeholder="请输入接口编码" class="flex-1" />
                  <NInput v-model:value="value['description']" placeholder="请输入接口描述" class="flex-1" />
                </div>
              </template>
              <template #action="{ index, create, remove }">
                <NSpace class="ml-12px">
                  <NButton size="medium" @click="() => create(index)">
                    <icon-ic-round-plus class="text-icon" />
                  </NButton>
                  <NButton size="medium" @click="() => remove(index)">
                    <icon-ic-round-remove class="text-icon" />
                  </NButton>
                </NSpace>
              </template>
            </NDynamicInput>
          </NFormItemGi>
        </NGrid>
      </NForm>
    </NScrollbar>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeDrawer">取消</NButton>
        <NButton type="primary" @click="handleSubmit">确认</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
