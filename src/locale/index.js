// see more : https://vue-i18n.intlify.dev/introduction.html
import { createI18n } from 'vue-i18n'
// import { createI18n } from 'vue-i18n/index'
import zh from "./language/zh.js"
import en from "./language/en.js"

const localeData = {
  legacy: false, // composition API
  locale: 'zh-CN',
  globalInjection: true, // 全局模式，可以直接使用 $t
  messages: {
    zh,
    en,
  }
}

export const i18n = createI18n(localeData)

export function setupI18n(app) {
  app.use(i18n)
}
