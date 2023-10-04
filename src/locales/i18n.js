import { createI18n } from 'vue-i18n'
import en from './english.json'
import tr from './turkish.json'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language'),
  globalInjection: true,
  fallbackLocale: 'en-US',
  messages: { 'en-US': en, 'tr-TR': tr }
})

export default i18n
