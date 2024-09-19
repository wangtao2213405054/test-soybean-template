<script setup lang="tsx">
import { ref } from "vue"
import type { Ref } from "vue"
import { NButton, NPopconfirm, NTag } from "naive-ui"
import { useBoolean } from "@sa/hooks"
import { batchDeleteMenuInfo, deleteMenuInfo, fetchGetAllPages, fetchGetMenuList } from "@/service/api"
import { useAppStore } from "@/store/modules/app"
import { useTable, useTableOperate } from "@/hooks/common/table"
import { yesOrNoRecord } from "@/constants/common"
import { enableStatusRecord, menuTypeRecord } from "@/constants/business"
import SvgIcon from "@/components/custom/svg-icon.vue"
import MenuOperateModal, { type OperateType } from "./modules/menu-operate-modal.vue"

const appStore = useAppStore()

const { bool: visible, setTrue: openModal } = useBoolean()

const wrapperRef = ref<HTMLElement | null>(null)

const { columns, columnChecks, data, loading, pagination, getData, getDataByPage } = useTable({
  apiFn: fetchGetMenuList,
  apiParams: { page: 1, pageSize: 20 },
  columns: () => [
    {
      type: "selection",
      align: "center",
      width: 48
    },
    {
      key: "id",
      title: "ID",
      align: "center"
    },
    {
      key: "menuType",
      title: "菜单类型",
      align: "center",
      width: 80,
      render: (row) => {
        const tagMap: Record<SystemManage.MenuType, NaiveUI.ThemeColor> = {
          1: "default",
          2: "primary"
        }

        const label = menuTypeRecord[row.menuType]

        return <NTag type={tagMap[row.menuType]}>{label}</NTag>
      }
    },
    {
      key: "menuName",
      title: "菜单名称",
      align: "center",
      minWidth: 120,
      render: (row) => {
        return <span>{row.menuName}</span>
      }
    },
    {
      key: "icon",
      title: "图标",
      align: "center",
      width: 60,
      render: (row) => {
        const icon = row.iconType === 1 ? row.icon : undefined

        const localIcon = row.iconType === 2 ? row.icon : undefined

        return (
          <div class="flex-center">
            <SvgIcon icon={icon} localIcon={localIcon} class="text-icon" />
          </div>
        )
      }
    },
    {
      key: "routeName",
      title: "路由名称",
      align: "center",
      minWidth: 120
    },
    {
      key: "routePath",
      title: "路由路径",
      align: "center",
      minWidth: 120,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: "status",
      title: "菜单状态",
      align: "center",
      width: 80,
      render: (row) => {
        if (row.status === null) {
          return null
        }
        const status = row.status ? 1 : 2
        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          1: "success",
          2: "warning"
        }
        const label = enableStatusRecord[status]

        return <NTag type={tagMap[status]}>{label}</NTag>
      }
    },
    {
      key: "hideInMenu",
      title: "隐藏菜单",
      align: "center",
      width: 80,
      render: (row) => {
        const hide: CommonType.YesOrNo = row.hideInMenu ? "Y" : "N"

        const tagMap: Record<CommonType.YesOrNo, NaiveUI.ThemeColor> = {
          Y: "error",
          N: "default"
        }

        const label = yesOrNoRecord[hide]

        return <NTag type={tagMap[hide]}>{label}</NTag>
      }
    },
    {
      key: "order",
      title: "排序",
      align: "center",
      width: 60
    },
    {
      key: "operate",
      title: "操作",
      align: "center",
      width: 230,
      render: (row) => (
        <div class="flex-center justify-end gap-8px">
          {row.menuType === 1 && (
            <NButton type="primary" ghost size="small" onClick={() => handleAddChildMenu(row)}>
              新增子菜单
            </NButton>
          )}
          <NButton type="primary" ghost size="small" onClick={() => handleEdit(row)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => "确认删除吗？",
              trigger: () => (
                <NButton type="error" ghost size="small">
                  删除
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
})

const { checkedRowKeys, onBatchDeleted, onDeleted } = useTableOperate(data, getData)

const operateType = ref<OperateType>("add")

function handleAdd() {
  operateType.value = "add"
  openModal()
}

async function handleBatchDelete() {
  const { error } = await batchDeleteMenuInfo(checkedRowKeys.value)

  if (!error) {
    await onBatchDeleted()
  }
}

async function handleDelete(id: number) {
  const { error } = await deleteMenuInfo(id)

  if (!error) {
    await onDeleted()
  }
}

/** the edit menu data or the parent menu data when adding a child menu */
const editingData: Ref<SystemManage.Menu | null> = ref(null)

function handleEdit(item: SystemManage.Menu) {
  operateType.value = "edit"
  editingData.value = { ...item }

  openModal()
}

function handleAddChildMenu(item: SystemManage.Menu) {
  operateType.value = "addChild"

  editingData.value = { ...item }

  openModal()
}

const allPages = ref<string[]>([])

async function getAllPages() {
  const { data: pages } = await fetchGetAllPages()
  allPages.value = pages || []
}

function init() {
  getAllPages()
}

// init
init()
</script>

<template>
  <div ref="wrapperRef" class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard title="菜单列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="1088"
        :loading="loading"
        :row-key="(row) => row.id"
        remote
        :pagination="pagination"
        class="sm:h-full"
      />
      <MenuOperateModal
        v-model:visible="visible"
        :operate-type="operateType"
        :row-data="editingData"
        :all-pages="allPages"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
