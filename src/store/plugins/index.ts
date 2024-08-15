import type { PiniaPluginContext } from "pinia"
import { jsonClone } from "@sa/utils"
import { SetupStoreId } from "@/enum"

/**
 * 这个插件用于重置通过 setup 语法编写的 store 的状态
 *
 * @param context Pinia 插件上下文
 */
export function resetSetupStore(context: PiniaPluginContext) {
  // 获取所有通过 setup 语法编写的 store 的 ID
  const setupSyntaxIds = Object.values(SetupStoreId) as string[]

  // 检查当前 store 的 ID 是否在 setupSyntaxIds 中
  if (setupSyntaxIds.includes(context.store.$id)) {
    // 获取当前 store 的状态
    const { $state } = context.store

    // 克隆 store 的初始状态
    const defaultStore = jsonClone($state)

    // 添加 $reset 方法到 store，用于重置状态
    context.store.$reset = () => {
      context.store.$patch(defaultStore)
    }
  }
}
