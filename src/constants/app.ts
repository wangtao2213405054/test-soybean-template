import { transformRecordToOption } from "@/utils/common"

// 全局头部菜单的标识符
export const GLOBAL_HEADER_MENU_ID = "__GLOBAL_HEADER_MENU__"

// 全局侧边菜单的标识符
export const GLOBAL_SIDER_MENU_ID = "__GLOBAL_SIDER_MENU__"

// 主题模式记录，映射主题模式到国际化键
export const themeSchemaRecord: Record<UnionKey.ThemeScheme, string> = {
  light: "亮色模式",
  dark: "暗黑模式",
  auto: "跟随系统"
}

// 将主题模式记录转换为选项列表
export const themeSchemaOptions = transformRecordToOption(themeSchemaRecord)

// 登录模块记录，映射登录模块到国际化键
export const loginModuleRecord: Record<UnionKey.LoginModule, string> = {
  "pwd-login": "密码登录",
  "code-login": "验证码登录",
  register: "注册账号",
  "reset-pwd": "重置密码",
  "bind-wechat": "绑定微信"
}

// 主题布局模式记录，映射布局模式到国际化键
export const themeLayoutModeRecord: Record<UnionKey.ThemeLayoutMode, string> = {
  vertical: "左侧菜单模式",
  "vertical-mix": "左侧菜单混合模式",
  horizontal: "顶部菜单模式",
  "horizontal-mix": "顶部菜单混合模式"
}

// 将主题布局模式记录转换为选项列表
export const themeLayoutModeOptions = transformRecordToOption(themeLayoutModeRecord)

// 主题滚动模式记录，映射滚动模式到国际化键
export const themeScrollModeRecord: Record<UnionKey.ThemeScrollMode, string> = {
  wrapper: "外层滚动",
  content: "主体滚动"
}

// 将主题滚动模式记录转换为选项列表
export const themeScrollModeOptions = transformRecordToOption(themeScrollModeRecord)

// 主题标签模式记录，映射标签模式到国际化键
export const themeTabModeRecord: Record<UnionKey.ThemeTabMode, string> = {
  chrome: "谷歌风格",
  button: "按钮风格"
}

// 将主题标签模式记录转换为选项列表
export const themeTabModeOptions = transformRecordToOption(themeTabModeRecord)

// 主题页面动画模式记录，映射动画模式到国际化键
export const themePageAnimationModeRecord: Record<UnionKey.ThemePageAnimateMode, string> = {
  "fade-slide": "滑动",
  fade: "淡入淡出",
  "fade-bottom": "底部消退",
  "fade-scale": "缩放消退",
  "zoom-fade": "渐变",
  "zoom-out": "闪现",
  none: "无"
}

// 将主题页面动画模式记录转换为选项列表
export const themePageAnimationModeOptions = transformRecordToOption(themePageAnimationModeRecord)
