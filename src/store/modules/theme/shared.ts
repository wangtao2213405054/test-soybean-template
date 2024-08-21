import type { GlobalThemeOverrides } from "naive-ui"
import { addColorAlpha, getColorPalette, getPaletteColorByNumber, getRgb } from "@sa/color"
import { overrideThemeSettings, themeSettings } from "@/theme/settings"
import { themeVars } from "@/theme/vars"
import { toggleHtmlClass } from "@/utils/common"
import { localStg } from "@/utils/storage"

const DARK_CLASS = "dark"

/** 初始化主题设置 */
export function initThemeSettings() {
  const isProd = import.meta.env.PROD

  // 如果是开发模式，则不会缓存主题设置，通过在 `src/theme/settings.ts` 更新 `themeSettings` 来更新主题设置
  if (!isProd) return themeSettings

  // 如果是生产模式，主题设置将缓存到 localStorage 中
  // 如果想在发布新版本时更新主题设置，请在 `src/theme/settings.ts` 中更新 `overrideThemeSettings`

  const settings = localStg.get("themeSettings") || themeSettings

  const isOverride = localStg.get("overrideThemeFlag") === BUILD_TIME

  if (!isOverride) {
    Object.assign(settings, overrideThemeSettings)
    localStg.set("overrideThemeFlag", BUILD_TIME)
  }

  return settings
}

/**
 * 根据主题设置创建主题 token CSS 变量值
 *
 * @param colors 主题颜色
 * @param tokens 主题设置 tokens
 * @param [recommended=false] 是否使用推荐颜色，默认值为 `false`. Default is `false`
 */
export function createThemeToken(
  colors: App.Theme.ThemeColor,
  tokens?: App.Theme.ThemeSetting["tokens"],
  recommended = false
) {
  const paletteColors = createThemePaletteColors(colors, recommended)

  const { light, dark } = tokens || themeSettings.tokens

  const themeTokens: App.Theme.ThemeTokenCSSVars = {
    colors: {
      ...paletteColors,
      nprogress: paletteColors.primary,
      ...light.colors
    },
    boxShadow: {
      ...light.boxShadow
    }
  }

  const darkThemeTokens: App.Theme.ThemeTokenCSSVars = {
    colors: {
      ...themeTokens.colors,
      ...dark?.colors
    },
    boxShadow: {
      ...themeTokens.boxShadow,
      ...dark?.boxShadow
    }
  }

  return {
    themeTokens,
    darkThemeTokens
  }
}

/**
 * 创建主题调色板颜色
 *
 * @param colors 主题颜色
 * @param [recommended=false] 是否使用推荐颜色，默认值为 `false`. Default is `false`
 */
function createThemePaletteColors(colors: App.Theme.ThemeColor, recommended = false) {
  const colorKeys = Object.keys(colors) as App.Theme.ThemeColorKey[]
  const colorPaletteVar = {} as App.Theme.ThemePaletteColor

  colorKeys.forEach((key) => {
    const colorMap = getColorPalette(colors[key], recommended)

    colorPaletteVar[key] = colorMap.get(500)!

    colorMap.forEach((hex, number) => {
      colorPaletteVar[`${key}-${number}`] = hex
    })
  })

  return colorPaletteVar
}

/**
 * 根据 tokens 获取 CSS 变量
 *
 * @param tokens 主题基础 tokens
 */
function getCssVarByTokens(tokens: App.Theme.BaseToken) {
  const styles: string[] = []

  function removeVarPrefix(value: string) {
    return value.replace("var(", "").replace(")", "")
  }

  function removeRgbPrefix(value: string) {
    return value.replace("rgb(", "").replace(")", "")
  }

  for (const [key, tokenValues] of Object.entries(themeVars)) {
    for (const [tokenKey, tokenValue] of Object.entries(tokenValues)) {
      let cssVarsKey = removeVarPrefix(tokenValue)
      let cssValue = tokens[key][tokenKey]

      if (key === "colors") {
        cssVarsKey = removeRgbPrefix(cssVarsKey)
        const { r, g, b } = getRgb(cssValue)
        cssValue = `${r} ${g} ${b}`
      }

      styles.push(`${cssVarsKey}: ${cssValue}`)
    }
  }

  return styles.join(";")
}

/**
 * 将主题变量添加到全局
 *
 * @param tokens 主题 tokens
 * @param darkTokens 暗色模式 tokens
 */
export function addThemeVarsToGlobal(tokens: App.Theme.BaseToken, darkTokens: App.Theme.BaseToken) {
  const cssVarStr = getCssVarByTokens(tokens)
  const darkCssVarStr = getCssVarByTokens(darkTokens)

  const css = `
    :root {
      ${cssVarStr}
    }
  `

  const darkCss = `
    html.${DARK_CLASS} {
      ${darkCssVarStr}
    }
  `

  const styleId = "theme-vars"

  const style = document.querySelector(`#${styleId}`) || document.createElement("style")

  style.id = styleId

  style.textContent = css + darkCss

  document.head.appendChild(style)
}

/**
 * 切换 CSS 深色模式
 *
 * @param darkMode 是否为深色模式
 */
export function toggleCssDarkMode(darkMode = false) {
  const { add, remove } = toggleHtmlClass(DARK_CLASS)

  if (darkMode) {
    add()
  } else {
    remove()
  }
}

/**
 * 切换辅助色彩模式
 *
 * @param grayscaleMode 是否启用灰度模式
 * @param colourWeakness 是否启用色弱模式
 */
export function toggleAuxiliaryColorModes(grayscaleMode = false, colourWeakness = false) {
  const htmlElement = document.documentElement
  htmlElement.style.filter = [grayscaleMode ? "grayscale(100%)" : "", colourWeakness ? "invert(80%)" : ""]
    .filter(Boolean)
    .join(" ")
}

type NaiveColorScene = "" | "Suppl" | "Hover" | "Pressed" | "Active"
type NaiveColorKey = `${App.Theme.ThemeColorKey}Color${NaiveColorScene}`
type NaiveThemeColor = Partial<Record<NaiveColorKey, string>>
interface NaiveColorAction {
  scene: NaiveColorScene
  handler: (color: string) => string
}

/**
 * 获取 Naive 主题颜色
 *
 * @param colors 主题颜色
 * @param [recommended=false] 是否使用推荐颜色，默认值为 `false`. Default is `false`
 */
function getNaiveThemeColors(colors: App.Theme.ThemeColor, recommended = false) {
  const colorActions: NaiveColorAction[] = [
    { scene: "", handler: (color) => color },
    { scene: "Suppl", handler: (color) => color },
    { scene: "Hover", handler: (color) => getPaletteColorByNumber(color, 500, recommended) },
    { scene: "Pressed", handler: (color) => getPaletteColorByNumber(color, 700, recommended) },
    { scene: "Active", handler: (color) => addColorAlpha(color, 0.1) }
  ]

  const themeColors: NaiveThemeColor = {}

  const colorEntries = Object.entries(colors) as [App.Theme.ThemeColorKey, string][]

  colorEntries.forEach((color) => {
    colorActions.forEach((action) => {
      const [colorType, colorValue] = color
      const colorKey: NaiveColorKey = `${colorType}Color${action.scene}`
      themeColors[colorKey] = action.handler(colorValue)
    })
  })

  return themeColors
}

/**
 * 获取 Naive 主题
 *
 * @param colors 主题颜色
 * @param [recommended=false] 是否使用推荐颜色，默认值为 `false`. Default is `false`
 */
export function getNaiveTheme(colors: App.Theme.ThemeColor, recommended = false) {
  const { primary: colorLoading } = colors

  const theme: GlobalThemeOverrides = {
    common: {
      ...getNaiveThemeColors(colors, recommended),
      borderRadius: "6px"
    },
    LoadingBar: {
      colorLoading
    },
    Tag: {
      borderRadius: "6px"
    }
  }

  return theme
}
