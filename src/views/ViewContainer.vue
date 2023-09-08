<script setup>
  import MovieView from './MovieView.vue'
  import PersonView from '../views/PersonView.vue'
  import { watch, onBeforeMount, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useDbStore } from '../stores/dbStore'
  import { useI18n } from 'vue-i18n'
  const { locale } = useI18n()
  const store = useDbStore()
  const route = useRoute()
  const language = ref(locale)
  function getdata() {
    store.resetStore()
    if (route.params.type === 'person') {
      store.getPerson(route.params.id)
    } else if (route.params.type === 'movie' || route.params.type === 'tv') {
      store.getShared(route.params.type, route.params.id, language.value)
    }
  }
  onBeforeMount(() => {
    getdata()
  })
  onMounted(() => {
    watch(
      () => route.params.type,
      () => getdata()
    )
    watch(
      () => language.value,
      () => getdata()
    )
  })
</script>

<template>
  <div class="movie" v-if="$route.params.type === 'movie' || $route.params.type === 'tv'">
    <MovieView />
  </div>

  <div class="person" v-if="$route.params.type === 'person'">
    <PersonView />
  </div>
</template>

<style scoped></style>
