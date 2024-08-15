import { computed, onScopeDispose, ref } from "vue"
import { useRafFn } from "@vueuse/core"

/**
 * 倒计时功能
 *
 * @param seconds - 倒计时的秒数
 */
export default function useCountDown(seconds: number) {
  const FPS_PER_SECOND = 60 // 每秒帧数

  const fps = ref(0) // 当前帧数计数

  // 计算当前剩余的秒数
  const count = computed(() => Math.ceil(fps.value / FPS_PER_SECOND))

  // 判断是否正在倒计时
  const isCounting = computed(() => fps.value > 0)

  const { pause, resume } = useRafFn(
    () => {
      if (fps.value > 0) {
        fps.value -= 1 // 每帧减少 1
      } else {
        pause() // 如果帧数为 0，暂停倒计时
      }
    },
    { immediate: false } // 不立即开始倒计时
  )

  /**
   * 开始倒计时
   *
   * @param updateSeconds - 更新的倒计时秒数，默认为初始传入的秒数
   */
  function start(updateSeconds: number = seconds) {
    fps.value = FPS_PER_SECOND * updateSeconds // 将秒数转换为帧数
    resume() // 开始倒计时
  }

  /** 停止倒计时 */
  function stop() {
    fps.value = 0 // 将帧数重置为 0
    pause() // 暂停倒计时
  }

  // 当组件作用域销毁时，暂停倒计时
  onScopeDispose(() => {
    pause()
  })

  return {
    count, // 剩余的秒数
    isCounting, // 是否正在倒计时
    start, // 开始倒计时
    stop // 停止倒计时
  }
}
