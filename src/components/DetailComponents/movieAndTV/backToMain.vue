<script setup>
  import { useRoute } from 'vue-router'
  import { useDbStore } from '@/stores/dbStore'
  const store = useDbStore()
  import { toRefs, onBeforeMount } from 'vue'
  const { shared, person } = toRefs(store)

  const route = useRoute()

  onBeforeMount(() => {})
</script>

<template>
  <template v-if="shared">
    <div class="goBack" :style="{ 'background-color': shared.color }">
      <img :src="store.imageURL('w92', shared.poster_path)" alt="" />
      <div class="sharedTitle">
        <app-link :to="'/' + route.params.type + '/' + route.params.id">
          <h2>{{ shared.title }}</h2>
          <h2>{{ shared.name }}</h2>
        </app-link>
        <app-link :to="'/' + route.params.type + '/' + route.params.id">
          <icon-lib icon="fa-solid fa-arrow-left" /> Back to Main
        </app-link>
      </div>
    </div>
  </template>
  <template v-if="person">
    <div class="goBack" :style="{ 'background-color': person.color }">
      <img :src="store.imageURL('w92', person.profile_path)" alt="" />
      <div class="sharedTitle">
        <app-link :to="'/' + route.params.type + '/' + route.params.id">
          <h2>{{ person.name }}</h2>
        </app-link>
        <app-link :to="'/' + route.params.type + '/' + route.params.id">
          <icon-lib icon="fa-solid fa-arrow-left" /> {{ $t('Back to Main') }}
        </app-link>
      </div>
    </div>
  </template>
</template>

<style scoped>
  @media all and (min-width: 751px) {
    .goBack img {
      width: 92px;
    }
  }
  @media all and (max-width: 750px) {
    .goBack img {
      width: 60px;
    }
  }
  .goBack {
    padding: 1em;
    padding-left: 5em;
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 30px;
  }

  .goBack img {
    border-radius: 8px;
  }

  .sharedTitle {
    display: flex;
    row-gap: 10px;
    flex-direction: column;
  }

  .sharedTitle a {
    color: white;
  }

  a:hover {
    text-decoration: none;
    color: gray;
  }

  .sharedTitle h2 {
    margin: 0;
    height: max-content;
    width: max-content;
  }

  .sharedTitle h2 {
    font-size: 2em;
  }
</style>
