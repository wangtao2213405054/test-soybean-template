import useBoolean from "./use-boolean"

/**
 * 加载状态管理
 *
 * @param initValue 初始值
 */
export default function useLoading(initValue = false) {
  // 使用 useBoolean 钩子来管理布尔值状态
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(initValue)

  return {
    loading, // 当前加载状态
    startLoading, // 开始加载，将状态设置为 true
    endLoading // 结束加载，将状态设置为 false
  }
}
