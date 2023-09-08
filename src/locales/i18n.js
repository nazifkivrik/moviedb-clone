import { createI18n } from 'vue-i18n'
import en from './english.json'
import tr from './turkish.json'
const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  globalInjection: true,
  fallbackLocale: 'en-US',

  availableLocales: ['en-US', 'tr-TR'],
  messages: { 'en-US': en, 'tr-TR': tr }
})

export default i18n
