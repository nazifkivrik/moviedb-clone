<script setup>
import { onBeforeMount, } from 'vue'

import navbar from "../components/NavigationBar.vue"
import search from "../components/SearchArea.vue"
import ribbonComp from '../components/RibbonComp/ribbonComp.vue'
import { useDbStore } from "../stores/dbStore"
const store = useDbStore()


onBeforeMount(() => {
  store.resetStore()
  store.getList()
})


</script>

<template>
  <navbar />
  <search />
  <ribbonComp :button-names="['Today', 'This Week']" :header="'Trending'" :list="store.trendingLists.All" />
  <ribbonComp :button-names="['Streaming', 'Popular', 'TopRated', 'Upcoming']" :header="'Movies'"
    :list="store.movieLists" />
</template>
<style scoped></style>




