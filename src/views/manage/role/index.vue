<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from "naive-ui"
import { batchDeleteRoleInfo, deleteRoleInfo, fetchGetRoleList } from "@/service/api"
import { useAppStore } from "@/store/modules/app"
import { useTable, useTableOperate } from "@/hooks/common/table"
import { enableStatusRecord } from "@/constants/business"
import RoleOperateDrawer from "./modules/role-operate-drawer.vue"
import RoleSearch from "./modules/role-search.vue"

const appStore = useAppStore()

const {
  columns,
  columnChecks,
  data,
  loading,
  getData,
  getDataByPage,
  mobilePagination,
  searchParams,
  resetSearchParams
} = useTable({
  apiFn: fetchGetRoleList,
  apiParams: {
    page: 1,
    pageSize: 20,
    status: null,
    keyword: null
  },
  columns: () => [
    {
      type: "selection",
      align: "center",
      width: 48
    },
    {
      key: "index",
      title: "序号",
      width: 64,
      align: "center"
    },
    {
      key: "name",
      title: "角色名称",
      align: "center",
      minWidth: 120
    },
    {
      key: "describe",
      title: "角色描述",
      minWidth: 120
    },
    {
      key: "status",
      title: "角色状态",
      align: "center",
      width: 100,
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
      key: "operate",
      title: "操作",
      align: "center",
      width: 130,
      render: (row) => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
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

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data, getData)

/** 批量删除 */
async function handleBatchDelete() {
  const { error } = await batchDeleteRoleInfo(checkedRowKeys.value)

  if (!error) {
    await onBatchDeleted()
  }
}

/** 删除指定角色 */
async function handleDelete(id: number) {
  const { error } = await deleteRoleInfo(id)

  if (!error) {
    await onDeleted()
  }
}

/** 编辑 */
function edit(id: number) {
  handleEdit(id)
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <RoleSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="角色列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
        :scroll-x="702"
        :loading="loading"
        remote
        :row-key="(row) => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <RoleOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
