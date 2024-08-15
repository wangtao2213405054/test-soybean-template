import { ref } from "vue"

/**
 * Boolean 状态管理钩子
 *
 * @param initValue 初始值，默认为 false
 */
export default function useBoolean(initValue = false) {
  // 定义一个响应式布尔值
  const bool = ref(initValue)

  // 设置布尔值为指定值
  function setBool(value: boolean) {
    bool.value = value
  }

  // 将布尔值设置为 true
  function setTrue() {
    setBool(true)
  }

  // 将布尔值设置为 false
  function setFalse() {
    setBool(false)
  }

  // 切换布尔值
  function toggle() {
    setBool(!bool.value)
  }

  return {
    bool,
    setBool,
    setTrue,
    setFalse,
    toggle
  }
}
