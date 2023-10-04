import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import appLink from './components/appLink.vue'
import i18n from './locales/i18n'
import { vClickOutside } from '@/directives/vClickOutside.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleXmark, faCirclePlay, faUser } from '@fortawesome/free-regular-svg-icons'
import {
  faLink,
  faPlus,
  faCircleHalfStroke,
  faBell,
  faArrowLeft,
  faCaretRight,
  faCaretDown,
  faStar,
  faBars,
  faAngleRight,
  faAngleDown,
  faMagnifyingGlass,
  faXmark,
  faCheck,
  faAnglesUp,
  faLeftLong,
  faRightLong
} from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faImdb, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons'
library.add(
  faLink,
  faFacebook,
  faTwitter,
  faInstagram,
  faImdb,
  faCircleXmark,
  faCirclePlay,
  faPlus,
  faCircleHalfStroke,
  faBell,
  faArrowLeft,
  faCaretRight,
  faCaretDown,
  faStar,
  faBars,
  faUser,
  faAngleRight,
  faAngleDown,
  faMagnifyingGlass,
  faXmark,
  faCheck,
  faAnglesUp,
  faLeftLong,
  faRightLong
)
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYTM5ZmQxNzgyMTM2NzQwMjgxZThmOTg2MzliZjhjMyIsInN1YiI6IjY0MmRkMzBhYTZhNGMxMDBmNDJjNzkyNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pH71dmpF1xMXUASRPcJ_WUCcoTEK-4t9bloC61L07fo'
  }
}

const app = createApp(App)
app.component('AppLink', appLink)
app.component('icon-lib', FontAwesomeIcon)
app.use(createPinia())
app.use(i18n)
app.use(router)
app.directive('clickOutside', vClickOutside)
app.provide('fetchOptions', options)
app.mount('#app')
