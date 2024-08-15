import { computed } from "vue"
import { useCountDown, useLoading } from "@sa/hooks"
import { $t } from "@/locales"
import { REG_PHONE } from "@/constants/reg"

export function useCaptcha() {
  // 使用自定义 Hook 获取 loading 状态和控制函数
  const { loading, startLoading, endLoading } = useLoading()

  // 使用自定义 Hook 获取倒计时状态和控制函数
  const { count, start, stop, isCounting } = useCountDown(10)

  /** 获取验证码按钮的标签 根据 loading 状态和倒计时状态动态生成按钮文本 */
  const label = computed(() => {
    let text = $t("page.login.codeLogin.getCode")

    // 倒计时文本
    const countingLabel = $t("page.login.codeLogin.reGetCode", { time: count.value })

    if (loading.value) {
      text = "" // 正在加载时显示为空
    }

    if (isCounting.value) {
      text = countingLabel // 正在倒计时时显示倒计时文本
    }

    return text
  })

  /**
   * 验证手机号格式
   *
   * @param phone 手机号
   * @returns 如果手机号有效则返回 true，否则返回 false
   */
  function isPhoneValid(phone: string): boolean {
    // 手机号为空时显示错误提示
    if (phone.trim() === "") {
      window.$message?.error?.($t("form.phone.required"))
      return false
    }

    // 手机号格式不正确时显示错误提示
    if (!REG_PHONE.test(phone)) {
      window.$message?.error?.($t("form.phone.invalid"))
      return false
    }

    return true
  }

  /**
   * 获取验证码
   *
   * @param phone 手机号
   * @returns 无返回值
   */
  async function getCaptcha(phone: string): Promise<void> {
    const valid = isPhoneValid(phone)

    // 手机号无效或正在加载时不执行请求
    if (!valid || loading.value) {
      return
    }

    startLoading()

    // 模拟请求
    await new Promise((resolve) => {
      setTimeout(resolve, 500)
    })

    window.$message?.success?.($t("page.login.codeLogin.sendCodeSuccess"))

    start() // 启动倒计时

    endLoading()
  }

  return {
    label,
    start,
    stop,
    isCounting,
    loading,
    getCaptcha
  }
}
