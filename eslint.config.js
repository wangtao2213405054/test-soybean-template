import { defineConfig } from "@soybeanjs/eslint-config"

export default defineConfig(
  {
    vue: true,
    unocss: true,
    prettierRules: {
      /** 每一行的宽度 */
      printWidth: 120,
      /** Tab 键的空格数 */
      tabWidth: 2,
      /** 在对象中的括号之间是否用空格来间隔 */
      bracketSpacing: true,
      /** 箭头函数的参数无论有几个，都要括号包裹 */
      arrowParens: "always",
      /** 换行符的使用 */
      endOfLine: "auto",
      /** 是否采用单引号 */
      singleQuote: false,
      /** 是否加分号 */
      semi: false,
      /** 是否使用 Tab 格式化 */
      useTabs: false
    }
  },
  {
    rules: {
      "vue/multi-word-component-names": [
        "warn",
        {
          ignores: ["index", "App", "Register", "[id]", "[url]"]
        }
      ],
      "vue/component-name-in-template-casing": [
        "warn",
        "PascalCase",
        {
          registeredComponentsOnly: false,
          ignores: ["/^icon-/"]
        }
      ],
      "unocss/order-attributify": "off"
    }
  }
)
