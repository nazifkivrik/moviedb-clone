<script setup>
  import NavigationBar from './components/NavigationBar.vue'
  import theFooter from '@/components/theFooter.vue'
  import { onMounted, onUnmounted, ref } from 'vue'
  import { useAuthStore } from './stores/authStore'
  let lastScrollTop = 0
  const authStore = useAuthStore()
  function scrollDirectionEvent() {
    const currentScrollTop = window.scrollY

    if (currentScrollTop > lastScrollTop) {
      scrollDirection.value = false
    } else if (currentScrollTop < lastScrollTop) {
      scrollDirection.value = true
    }

    lastScrollTop = currentScrollTop
  }
  const scrollDirection = ref(true)
  onMounted(() => {
    window.addEventListener('scroll', scrollDirectionEvent)
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', scrollDirectionEvent)
  })
  onMounted(() => {
    authStore.init()
  })
</script>

<template>
  <body>
    <transition name="nav">
      <navigation-bar v-if="scrollDirection" />
    </transition>

    <router-view></router-view>
  </body>
  <the-footer></the-footer>
</template>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

  @media all and (max-width: 600px) {
    * {
      font-size: 10px;
    }
  }
  @media all and (min-width: 600px) {
    * {
      font-size: 12px;
    }
  }
  @media all and (min-width: 768px) {
    * {
      font-size: 14px;
    }
  }
  @media all and (min-width: 992px) {
    * {
      font-size: 16px;
    }
  }
  @media all and (min-width: 1200px) {
    * {
      font-size: 16px;
    }
  }

  a {
    text-decoration: none;
    color: black;
  }

  a:hover {
    text-decoration: underline;
  }

  * {
    font-family: 'Roboto', sans-serif;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    padding: 0;
    margin: 0;
  }

  .nav-enter-active,
  .nav-leave-active {
    transition: all 0.5s ease;
  }

  .nav-enter-from,
  .nav-leave-to {
    transform: translateY(-100%);
    opacity: 0;
  }
</style>
