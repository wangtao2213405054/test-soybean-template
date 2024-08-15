import { inject, provide } from "vue"
import type { InjectionKey } from "vue"

/**
 * 使用上下文管理
 *
 * @example
 *   ;```ts
 *   // 假设有三个 Vue 文件：A.vue, B.vue, C.vue，A.vue 是 B.vue 和 C.vue 的父组件
 *
 *   // context.ts
 *   import { ref } from 'vue';
 *   import { useContext } from '@sa/hooks';
 *
 *   export const { setupStore, useStore } = useContext('demo', () => {
 *     const count = ref(0);
 *
 *     function increment() {
 *       count.value++;
 *     }
 *
 *     function decrement() {
 *       count.value--;
 *     }
 *
 *     return {
 *       count,
 *       increment,
 *       decrement
 *     };
 *   });
 *   ``` // A.vue
 *   ```vue
 *   <template>
 *     <div>A</div>
 *   </template>
 *   <script setup lang="ts">
 *   import { setupStore } from './context';
 *
 *   setupStore();
 *   // 可以在父组件中直接控制 store
 *   // const { increment } = setupStore();
 *   </script>
 *   ``` // B.vue
 *   ```vue
 *   <template>
 *    <div>B</div>
 *   </template>
 *   <script setup lang="ts">
 *   import { useStore } from './context';
 *
 *   const { count, increment } = useStore();
 *   </script>
 *   ```
 *
 *   // C.vue 与 B.vue 类似
 *
 * @param contextName 上下文名称
 * @param fn 上下文函数
 */
export default function useContext<T extends (...args: any[]) => any>(contextName: string, fn: T) {
  type Context = ReturnType<T>

  const { useProvide, useInject: useStore } = createContext<Context>(contextName)

  function setupStore(...args: Parameters<T>) {
    const context: Context = fn(...args)
    return useProvide(context)
  }

  return {
    /** 在父组件中设置 store */
    setupStore,
    /** 在子组件中使用 store */
    useStore
  }
}

/** 创建上下文 */
function createContext<T>(contextName: string) {
  const injectKey: InjectionKey<T> = Symbol(contextName)

  function useProvide(context: T) {
    provide(injectKey, context)
    return context
  }

  function useInject() {
    return inject(injectKey) as T
  }

  return {
    useProvide,
    useInject
  }
}
