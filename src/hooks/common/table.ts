import type { Ref } from "vue"
import { computed, effectScope, onScopeDispose, reactive, ref, watch } from "vue"
import type { PaginationProps } from "naive-ui"
import { jsonClone } from "@sa/utils"
import { useBoolean, useHookTable } from "@sa/hooks"
import { useAppStore } from "@/store/modules/app"

// 定义表格数据类型
type TableData = NaiveUI.TableData
// 定义获取表格数据的类型
type GetTableData<A extends NaiveUI.TableApiFn> = NaiveUI.GetTableData<A>
// 定义表格列的类型
type TableColumn<T> = NaiveUI.TableColumn<T>

// 使用自定义的 useTable hook 函数
export function useTable<A extends NaiveUI.TableApiFn>(config: NaiveUI.NaiveTableConfig<A>) {
  // 创建一个 effectScope，用于管理副作用
  const scope = effectScope()
  // 获取应用状态管理的 store
  const appStore = useAppStore()

  // 计算属性，判断是否为移动设备
  const isMobile = computed(() => appStore.isMobile)

  // 从配置中获取 API 函数、参数、是否立即加载和是否显示总数
  const { apiFn, apiParams, immediate, showTotal } = config

  // 定义选择和展开列的键
  const SELECTION_KEY = "__selection__"
  const EXPAND_KEY = "__expand__"

  // 使用自定义的 useHookTable hook 来处理表格的状态和数据
  const {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    getData,
    searchParams,
    updateSearchParams,
    resetSearchParams
  } = useHookTable<A, GetTableData<A>, TableColumn<NaiveUI.TableDataWithIndex<GetTableData<A>>>>({
    apiFn,
    apiParams,
    columns: config.columns,
    transformer: (res) => {
      const { records = [], page = 1, pageSize = 10, total = 0 } = res.data || {}

      // 确保每页大小大于 0，否则会导致分页计算错误
      const size = pageSize <= 0 ? 10 : pageSize

      // 给每条记录添加索引
      const recordsWithIndex = records.map((item, index) => {
        return {
          ...item,
          index: (page - 1) * pageSize + index + 1
        }
      })

      return {
        data: recordsWithIndex,
        pageNum: page,
        pageSize: size,
        total
      }
    },
    getColumnChecks: (cols) => {
      const checks: NaiveUI.TableColumnCheck[] = []

      cols.forEach((column) => {
        if (isTableColumnHasKey(column)) {
          checks.push({
            key: column.key as string,
            title: column.title as string,
            checked: true
          })
        } else if (column.type === "selection") {
          checks.push({
            key: SELECTION_KEY,
            title: "勾选",
            checked: true
          })
        } else if (column.type === "expand") {
          checks.push({
            key: EXPAND_KEY,
            title: "展开列",
            checked: true
          })
        }
      })

      return checks
    },
    getColumns: (cols, checks) => {
      const columnMap = new Map<string, TableColumn<GetTableData<A>>>()

      cols.forEach((column) => {
        if (isTableColumnHasKey(column)) {
          columnMap.set(column.key as string, column)
        } else if (column.type === "selection") {
          columnMap.set(SELECTION_KEY, column)
        } else if (column.type === "expand") {
          columnMap.set(EXPAND_KEY, column)
        }
      })

      return checks
        .filter((item) => item.checked)
        .map((check) => columnMap.get(check.key) as TableColumn<GetTableData<A>>)
    },
    onFetched: async (transformed) => {
      const { pageNum, pageSize, total } = transformed

      // 更新分页信息
      updatePagination({
        page: pageNum,
        pageSize,
        itemCount: total
      })
    },
    immediate
  })

  // 初始化分页属性
  const pagination: PaginationProps = reactive({
    page: 1,
    pageSize: 20,
    showSizePicker: true,
    pageSizes: [10, 15, 20, 25, 30],
    onUpdatePage: async (page: number) => {
      pagination.page = page

      // 更新搜索参数并获取数据
      updateSearchParams({
        page,
        pageSize: pagination.pageSize!
      })

      await getData()
    },
    onUpdatePageSize: async (pageSize: number) => {
      pagination.pageSize = pageSize
      pagination.page = 1

      // 更新搜索参数并获取数据
      updateSearchParams({
        page: pagination.page,
        pageSize
      })

      await getData()
    },
    ...(showTotal
      ? {
          prefix: (page) => `共 ${page.itemCount} 条`
        }
      : {})
  })

  // 针对移动设备的分页设置
  const mobilePagination = computed(() => {
    const p: PaginationProps = {
      ...pagination,
      pageSlot: isMobile.value ? 3 : 9,
      prefix: !isMobile.value && showTotal ? pagination.prefix : undefined
    }

    return p
  })

  // 更新分页属性
  function updatePagination(update: Partial<PaginationProps>) {
    Object.assign(pagination, update)
  }

  /**
   * 根据页码获取数据
   *
   * @param pageNum 页码，默认值为 1
   */
  async function getDataByPage(pageNum: number = 1) {
    updatePagination({
      page: pageNum
    })

    // 更新搜索参数并获取数据
    updateSearchParams({
      page: pageNum,
      pageSize: pagination.pageSize!
    })

    await getData()
  }

  // 在应用语言发生变化时重新加载列
  scope.run(() => {
    watch(
      () => appStore.locale,
      () => {
        reloadColumns()
      }
    )
  })

  // 在组件卸载时停止 effectScope
  onScopeDispose(() => {
    scope.stop()
  })

  // 返回表格相关的数据和方法
  return {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    pagination,
    mobilePagination,
    updatePagination,
    getData,
    getDataByPage,
    searchParams,
    updateSearchParams,
    resetSearchParams
  }
}

// 使用自定义的 useTableOperate hook 函数
export function useTableOperate<T extends TableData = TableData>(data: Ref<T[]>, getData: () => Promise<void>) {
  // 控制抽屉的显示和隐藏
  const { bool: drawerVisible, setTrue: openDrawer, setFalse: closeDrawer } = useBoolean()

  // 操作类型，默认为 "add"
  const operateType = ref<NaiveUI.TableOperateType>("add")

  // 打开抽屉进行添加操作
  function handleAdd() {
    operateType.value = "add"
    openDrawer()
  }

  /** 编辑中的数据 */
  const editingData: Ref<T | null> = ref(null)

  // 打开抽屉进行编辑操作
  function handleEdit(id: T["id"]) {
    operateType.value = "edit"
    const findItem = data.value.find((item) => item.id === id) || null
    editingData.value = jsonClone(findItem)

    openDrawer()
  }

  /** 被选中的行的键 */
  const checkedRowKeys = ref<number[]>([])

  /** 批量删除操作完成后的钩子函数 */
  async function onBatchDeleted() {
    window.$message?.success("删除成功")

    checkedRowKeys.value = []

    await getData()
  }

  /** 删除操作完成后的钩子函数 */
  async function onDeleted() {
    window.$message?.success("删除成功")

    await getData()
  }

  // 返回表格操作相关的数据和方法
  return {
    drawerVisible,
    openDrawer,
    closeDrawer,
    operateType,
    handleAdd,
    editingData,
    handleEdit,
    checkedRowKeys,
    onBatchDeleted,
    onDeleted
  }
}

// 判断表格列是否有键
function isTableColumnHasKey<T>(column: TableColumn<T>): column is NaiveUI.TableColumnWithKey<T> {
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).key)
}
