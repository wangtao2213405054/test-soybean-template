import { computed, ref, shallowRef, triggerRef } from "vue"
import type {
  ComputedGetter,
  DebuggerOptions,
  Ref,
  ShallowRef,
  WritableComputedOptions,
  WritableComputedRef
} from "vue"

type Updater<T> = (value: T) => T
type Mutator<T> = (value: T) => void

/**
 * Signal 是一个可以设置、更新或更改的响应式值
 *
 * @example
 *   ```ts
 *   const count = useSignal(0);
 *
 *   // `watchEffect`
 *   watchEffect(() => {
 *   console.log(count());
 *   });
 *
 *   // watch
 *   watch(count, value => {
 *   console.log(value);
 *   });
 *
 *   // useComputed
 *   const double = useComputed(() => count() * 2);
 *   const writeableDouble = useComputed({
 *   get: () => count() * 2,
 *   set: value => count.set(value / 2)
 *   });
 *   ```
 */
export interface Signal<T> {
  (): Readonly<T>
  /**
   * 设置 Signal 的值
   *
   * 建议对原始值使用 `set`
   *
   * @param value
   */
  set(value: T): void
  /**
   * 使用更新函数更新 Signal 的值
   *
   * 建议对非原始值使用 `update`，对象的只有第一层是响应式的。
   *
   * @param updater
   */
  update(updater: Updater<T>): void
  /**
   * 使用更改器函数更改 Signal 的值
   *
   * 此操作将调用 `triggerRef`，因此该值将在 `watchEffect` 中被跟踪。
   *
   * 建议对非原始值使用 `mutate`，对象的所有层级都是响应式的。
   *
   * @param mutator
   */
  mutate(mutator: Mutator<T>): void
  /**
   * 获取 Signal 的引用
   *
   * 有时这可以使 `v-model` 与 Signal 一起工作
   *
   * ```vue
   * <template>
   *   <input v-model="model.count" />
   * </template>
   *
   * <script setup lang="ts">
   *  const state = useSignal({ count: 0 }, { useRef: true });
   *
   *  const model = state.getRef();
   * </script>
   * ```
   */
  getRef(): Readonly<ShallowRef<Readonly<T>>>
}

export interface ReadonlySignal<T> {
  (): Readonly<T>
}

export interface SignalOptions {
  /**
   * 是否使用 `ref` 来存储值
   *
   * @default false 使用 `shallowRef` 来存储值
   */
  useRef?: boolean
}

export function useSignal<T>(initialValue: T, options?: SignalOptions): Signal<T> {
  const { useRef } = options || {}

  const state = useRef ? (ref(initialValue) as Ref<T>) : shallowRef(initialValue)

  return createSignal(state)
}

export function useComputed<T>(getter: ComputedGetter<T>, debugOptions?: DebuggerOptions): ReadonlySignal<T>
export function useComputed<T>(options: WritableComputedOptions<T>, debugOptions?: DebuggerOptions): Signal<T>
export function useComputed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
  debugOptions?: DebuggerOptions
) {
  const isGetter = typeof getterOrOptions === "function"

  const computedValue = computed(getterOrOptions as any, debugOptions)

  if (isGetter) {
    return () => computedValue.value as ReadonlySignal<T>
  }

  return createSignal(computedValue)
}

function createSignal<T>(state: ShallowRef<T> | WritableComputedRef<T>): Signal<T> {
  const signal = () => state.value

  signal.set = (value: T) => {
    state.value = value
  }

  signal.update = (updater: Updater<T>) => {
    state.value = updater(state.value)
  }

  signal.mutate = (mutator: Mutator<T>) => {
    mutator(state.value)
    triggerRef(state)
  }

  signal.getRef = () => state as Readonly<ShallowRef<Readonly<T>>>

  return signal
}
