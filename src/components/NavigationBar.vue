<script setup>
  import appLink from './appLink.vue'
  import { ref, computed, onBeforeMount } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import customSelect from '@/components/customSelectMenu.vue'
  import { useAuthStore } from '@/stores/authStore.js'
  const authStore = useAuthStore()
  const { availableLocales } = useI18n()
  const isMobile = computed(() => {
    return window.innerWidth
  })
  function changeLocalStorage(val) {
    localStorage.setItem('language', val.code)
    router.go(0)
  }
  function getLocalStorage() {
    let lang = localStorage.getItem('language') || 'en-US'
    let returnobj
    availableLanguages.value.forEach((language) => {
      if (language.code === lang) {
        returnobj = language
      }
    })
    return returnobj
  }

  const toggle = ref(false)
  const router = useRouter()
  const availableLanguages = ref()
  function filterLanguage(availableLocales, languageList) {
    let lang = []
    languageList.forEach((element) => {
      availableLocales.forEach((available) => {
        if (available.split('-')[0] === element.iso_639_1) {
          element.code = available
          element.name = element.name + '(' + element.code + ')'
          lang.push(element)
        }
      })
    })
    return lang
  }
  const languages = [
    { english_name: 'English', iso_639_1: 'en', name: 'English' },
    { english_name: 'Turkish', iso_639_1: 'tr', name: 'Türkçe' }
  ]
  async function initialize() {
    availableLanguages.value = filterLanguage(availableLocales, languages)
  }
  const logout = () => {
    authStore.logoutUser()
  }
  onBeforeMount(() => {
    initialize()
  })
</script>

<template>
  <header>
    <div class="logoandmenu">
      <div class="logo">
        <appLink to="/">TMDB-C</appLink>
      </div>
      <nav>
        <ul>
          <li>
            <h1>{{ $t('Movies') }}</h1>
            <ul>
              <li>
                <app-link :to="{ path: '/movie', query: { query: 'popular' } }">{{
                  $t('Popular')
                }}</app-link>
              </li>
              <li>
                <app-link :to="{ path: '/movie', query: { query: 'now-playing' } }">{{
                  $t('Now Playing')
                }}</app-link>
              </li>
              <li>
                <app-link :to="{ path: '/movie', query: { query: 'upcoming' } }">{{
                  $t('Upcoming')
                }}</app-link>
              </li>
              <li>
                <app-link :to="{ path: '/movie', query: { query: 'top-rated' } }">{{
                  $t('Top Rated')
                }}</app-link>
              </li>
            </ul>
          </li>
          <li>
            <h1>{{ $t('TV Shows') }}</h1>
            <ul>
              <app-link :to="{ path: '/tv', query: { query: 'popular' } }">{{
                $t('Popular')
              }}</app-link>
              <app-link :to="{ path: '/tv', query: { query: 'airing-today' } }">{{
                $t('Airing Today')
              }}</app-link>
              <app-link :to="{ path: '/tv', query: { query: 'on-the-air' } }">{{
                $t('On TV')
              }}</app-link>
              <app-link :to="{ path: '/tv', query: { query: 'top-rated' } }">{{
                $t('Top Rated')
              }}</app-link>
            </ul>
          </li>
          <li>
            <h1>{{ $t('People') }}</h1>
            <ul>
              <li>{{ $t('Popular People') }}</li>
            </ul>
          </li>
          <li>
            <h1>{{ $t('More') }}</h1>
          </li>
        </ul>
      </nav>
    </div>
    <div class="othermenus" v-if="isMobile > 800">
      <customSelect
        :dropdownArr="availableLanguages"
        :defaultVal="getLocalStorage()"
        :objectKey="'name'"
        @selectedVal="changeLocalStorage"
        v-if="availableLanguages" />

      <icon-lib icon="fa-solid fa-plus" size="lg" />
      <icon-lib icon="fa-solid fa-circle-half-stroke" size="lg" />
      <icon-lib icon="fa-solid fa-bell" size="lg" />
      <div>
        <div v-if="authStore.user" class="profile">
          <ul>
            <li>
              <img src="" alt="" v-if="authStore.user.avatar" />
              <span v-else>{{ authStore.user.username }}</span>
            </li>
            <li>Discussions</li>
            <li>Lists</li>
            <li>Ratings</li>
            <li>Watchlist</li>
            <li><app-link :to="'/settings'">Settings</app-link></li>
            <li @click="logout">Logout</li>
          </ul>
        </div>
        <div v-else>
          <appLink :to="{ path: '/login' }">Login/Register</appLink>
        </div>
      </div>
    </div>
    <aside :class="[toggle ? 'open' : 'close']">
      <div @click="() => (toggle = !toggle)" v-if="isMobile <= 800" class="toggleButton">
        <icon-lib icon="fa-solid fa-bars" size="2xl" />
      </div>
      <div class="sideBarItems" v-if="toggle">
        <customSelect
          :dropdownArr="availableLanguages"
          :defaultVal="getLocalStorage()"
          :objectKey="'name'"
          @selectedVal="changeLocalStorage"
          v-if="availableLanguages" />
        <span> <icon-lib icon="fa-solid fa-plus" size="lg" /> Add</span>
        <span> <icon-lib icon="fa-solid fa-circle-half-stroke" size="lg" /> Theme </span>
        <span> <icon-lib icon="fa-solid fa-bell" size="lg" /> Notifications</span>
        <span>
          <div>
            <div v-if="authStore.user" class="profile">
              <span><icon-lib icon="fa-regular fa-user" />{{ authStore.user.username }}</span>
            </div>
            <div v-else>
              <appLink :to="{ path: '/login' }">Login/Register</appLink>
            </div>
          </div></span
        >
      </div>
    </aside>
  </header>
</template>

<style scoped lang="scss">
  .open {
    width: 120px;
  }
  .close {
    width: 35px;
  }
  ul {
    list-style: none;
    padding-inline-start: 0;
  }
  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #032541;
    color: white;
    width: 100%;
    height: 3.5em;
    position: fixed;
    z-index: 110;
    .logoandmenu {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .logo {
        font-weight: 600;
        margin-left: 50px;
        a {
          color: white;
          font-size: 1.1em;
          text-decoration: none;
        }
      }
      nav {
        padding-left: 25px;
        display: flex;
        flex-direction: row;
        width: max-content;

        li {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
        > ul {
          display: flex;
          column-gap: 20px;

          > li {
            height: 1.1em;
            overflow: hidden;
            position: relative;

            &:hover {
              overflow: visible;
            }
            > ul {
              position: absolute;
              background-color: white;
              z-index: 1000;
              color: black;
              display: flex;
              flex-direction: column;
              padding-top: 8px;
              padding: 1em;
              row-gap: 5px;
              border-radius: 5px;
              width: max-content;
            }
          }
        }
        h1 {
          display: inline-flex;
          font-weight: 500;
          margin: 0;
          font-size: 1em;
        }
      }
    }

    aside {
      position: absolute;
      top: 0;
      right: 5px;
      display: flex;
      flex-direction: column;
      z-index: 10000;

      .toggleButton {
        position: absolute;
        right: 5px;
        top: 5px;
      }
      .sideBarItems {
        position: absolute;
        display: flex;
        flex-direction: column;
        row-gap: 15px;
        padding: 15px 0;
        align-items: center;
        height: max-content;
        width: 120px;
        top: 3.5em;
        z-index: 120;
        background-color: #032541;
        select {
          width: 10em;
        }
      }
    }
    .othermenus {
      a {
        color: white;
      }
      display: flex;
      column-gap: 30px;
      margin-right: 30px;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 600;
      .profile {
        display: flex;
        align-items: center;
        justify-content: center;

        ul {
          overflow: hidden;
          height: 1em;
          margin: 0;
          color: white;

          &:hover {
            overflow: visible;
            border-radius: 5px;
          }
          li {
            &:nth-child(1) {
              padding: 0;
            }
            cursor: pointer;
            background-color: #032541;
            padding: 7px 15px;
          }
        }
      }
    }
  }
</style>
