import { computed, reactive, ref } from "vue"
import type { Ref } from "vue"
import { jsonClone } from "@sa/utils"
import useBoolean from "./use-boolean"
import useLoading from "./use-loading"

export type MaybePromise<T> = T | Promise<T>

export type ApiFn = (args: any) => Promise<unknown>

export type TableColumnCheck = {
  key: string
  title: string
  checked: boolean
}

export type TableDataWithIndex<T> = T & { index: number }

export type TransformedData<T> = {
  data: TableDataWithIndex<T>[]
  pageNum: number
  pageSize: number
  total: number
}

export type Transformer<T, Response> = (response: Response) => TransformedData<T>

export type TableConfig<A extends ApiFn, T, C> = {
  /** 获取表格数据的 API 函数 */
  apiFn: A
  /** API 参数 */
  apiParams?: Parameters<A>[0]
  /** 将 API 响应转换为表格数据 */
  transformer: Transformer<T, Awaited<ReturnType<A>>>
  /** 列的工厂函数 */
  columns: () => C[]
  /**
   * 获取列检查项
   *
   * @param columns 列
   */
  getColumnChecks: (columns: C[]) => TableColumnCheck[]
  /**
   * 获取实际使用的列
   *
   * @param columns 列
   * @param checks 列检查项
   */
  getColumns: (columns: C[], checks: TableColumnCheck[]) => C[]
  /**
   * 数据获取后的回调函数
   *
   * @param transformed 转换后的数据
   */
  onFetched?: (transformed: TransformedData<T>) => MaybePromise<void>
  /**
   * 是否立即获取数据
   *
   * @default true
   */
  immediate?: boolean
}

export default function useHookTable<A extends ApiFn, T, C>(config: TableConfig<A, T, C>) {
  const { loading, startLoading, endLoading } = useLoading()
  const { bool: empty, setBool: setEmpty } = useBoolean()

  const { apiFn, apiParams, transformer, immediate = true, getColumnChecks, getColumns } = config

  const searchParams: NonNullable<Parameters<A>[0]> = reactive(jsonClone({ ...apiParams }))

  const allColumns = ref(config.columns()) as Ref<C[]>

  const data: Ref<TableDataWithIndex<T>[]> = ref([])

  const columnChecks: Ref<TableColumnCheck[]> = ref(getColumnChecks(config.columns()))

  const columns = computed(() => getColumns(allColumns.value, columnChecks.value))

  /** 重新加载列配置 */
  function reloadColumns() {
    allColumns.value = config.columns()

    const checkMap = new Map(columnChecks.value.map((col) => [col.key, col.checked]))

    const defaultChecks = getColumnChecks(allColumns.value)

    columnChecks.value = defaultChecks.map((col) => ({
      ...col,
      checked: checkMap.get(col.key) ?? col.checked
    }))
  }

  /** 获取数据 */
  async function getData() {
    startLoading()

    const formattedParams = formatSearchParams(searchParams)

    const response = await apiFn(formattedParams)

    const transformed = transformer(response as Awaited<ReturnType<A>>)
    data.value = transformed.data

    setEmpty(transformed.data.length === 0)

    await config.onFetched?.(transformed)

    endLoading()
  }

  /** 格式化搜索参数 */
  function formatSearchParams(params: Record<string, unknown>) {
    const formattedParams: Record<string, unknown> = {}

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formattedParams[key] = value
      }
    })

    return formattedParams
  }

  /**
   * 更新搜索参数
   *
   * @param params 新的搜索参数
   */
  function updateSearchParams(params: Partial<Parameters<A>[0]>) {
    Object.assign(searchParams, params)
  }

  /** 重置搜索参数 */
  function resetSearchParams() {
    Object.assign(searchParams, jsonClone(apiParams))
  }

  if (immediate) {
    getData()
  }

  return {
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
  }
}
