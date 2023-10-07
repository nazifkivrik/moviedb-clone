import { createI18n } from 'vue-i18n'
import en from './english.json'
import tr from './turkish.json'
import { datetimeFormats } from '@/locales/datetimeFormats.js'
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language'),
  globalInjection: true,
  fallbackLocale: 'en-US',
  messages: { 'en-US': en, 'tr-TR': tr },
  datetimeFormats
})

export default i18n
