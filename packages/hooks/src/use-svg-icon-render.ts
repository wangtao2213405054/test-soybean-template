import { h } from "vue"
import type { Component } from "vue"

/**
 * Svg 图标渲染 Hook
 *
 * @param SvgIcon Svg 图标组件
 */
export default function useSvgIconRender(SvgIcon: Component) {
  interface IconConfig {
    /** Iconify 图标名称 */
    icon?: string
    /** 本地图标名称 */
    localIcon?: string
    /** 图标颜色 */
    color?: string
    /** 图标大小 */
    fontSize?: number
  }

  type IconStyle = Partial<Pick<CSSStyleDeclaration, "color" | "fontSize">>

  /**
   * Svg 图标的 VNode
   *
   * @param config 图标配置
   */
  const SvgIconVNode = (config: IconConfig) => {
    const { color, fontSize, icon, localIcon } = config

    const style: IconStyle = {}

    // 如果设置了颜色，则应用到样式中
    if (color) {
      style.color = color
    }
    // 如果设置了图标大小，则应用到样式中
    if (fontSize) {
      style.fontSize = `${fontSize}px`
    }

    // 如果没有传入图标名称或本地图标名称，返回 undefined
    if (!icon && !localIcon) {
      return undefined
    }

    // 使用 `h` 函数创建 SvgIcon 组件的 VNode
    return () => h(SvgIcon, { icon, localIcon, style })
  }

  return {
    SvgIconVNode
  }
}
