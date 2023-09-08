<script setup>
  import appLink from './appLink.vue'
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  const { locale } = useI18n()
  const isMobile = computed(() => {
    return window.innerWidth
  })
  const toggle = ref(false)
</script>

<template>
  <header>
    <div class="logoandmenu">
      <div class="logo">
        <appLink to="/">TMDB-C</appLink>
      </div>
      <nav>
        <h1>{{ $t('Movies') }}</h1>
        <h1>{{ $t('TV Shows') }}</h1>
        <h1>{{ $t('People') }}</h1>
        <h1>{{ $t('More') }}</h1>
      </nav>
    </div>
    <div class="othermenus" v-if="isMobile > 800">
      <select v-model="locale">
        <option v-for="locale in $i18n.availableLocales" :key="locale">
          {{ locale }}
        </option>
      </select>
      <icon-lib icon="fa-solid fa-plus" size="lg" />
      <icon-lib icon="fa-solid fa-circle-half-stroke" size="lg" />
      <icon-lib icon="fa-solid fa-bell" size="lg" />
      <button>N</button>
    </div>
    <aside :class="[toggle ? 'open' : 'close']">
      <div @click="() => (toggle = !toggle)" v-if="isMobile <= 800" class="toggleButton">
        <icon-lib icon="fa-solid fa-bars" size="2xl" />
      </div>
      <div class="sideBarItems" v-if="toggle">
        <select v-model="locale">
          <option v-for="locale in $i18n.availableLocales" :key="locale">
            {{ locale }}
          </option>
        </select>
        <span> <icon-lib icon="fa-solid fa-plus" size="lg" /> Add</span>
        <span> <icon-lib icon="fa-solid fa-circle-half-stroke" size="lg" /> Theme </span>
        <span> <icon-lib icon="fa-solid fa-bell" size="lg" /> Notifications</span>
        <span><icon-lib icon="fa-regular fa-user" /> Profile</span>
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
  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #032541;
    color: white;
    position: relative;
    z-index: 5;
    width: 100%;
    height: 3.5em;
    position: sticky;
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
        h1 {
          display: inline-flex;
          font-weight: 500;
          font-size: 1em;
          margin-left: 10px;
        }
      }
    }

    aside {
      position: absolute;
      top: 0;
      right: 5px;
      display: flex;
      flex-direction: column;
      z-index: 10;

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
      display: flex;
      column-gap: 30px;
      margin-right: 30px;
      align-items: center;
      justify-content: center;
      button {
        background-color: lightblue;
        color: white;
        width: 2em;
        height: 2em;
        border-radius: 50%;
      }
    }
  }
</style>
