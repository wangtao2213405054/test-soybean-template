import { extend } from "dayjs"
import localeData from "dayjs/plugin/localeData"
import { setDayjsLocale } from "@/locales/dayjs"

export function setupDayjs() {
  // 扩展 dayjs 插件，以便使用 localeData 插件
  extend(localeData)

  // 设置 dayjs 的本地化配置
  setDayjsLocale()
}
