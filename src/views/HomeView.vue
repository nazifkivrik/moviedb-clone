<script setup>
  import { onBeforeMount, reactive, ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
  import { useI18n } from 'vue-i18n'
  import search from '../components/SearchArea.vue'
  import ribbonComp from '@/components/RibbonComp/ribbonComp.vue'
  import { useDbStore } from '@/stores/dbStore'
  const store = useDbStore()
  const { t, locale } = useI18n()
  const objTemplate = { currentPage: null, totalPage: null, array: [] }
  const movieRibbonObj = reactive([objTemplate, objTemplate, objTemplate, objTemplate])
  const movieRibbonEnum = ['now_playing', 'popular', 'top_rated', 'upcoming']
  const movieRibbonSelectedIndex = ref(0)
  const trendingRibbonObj = reactive([objTemplate, objTemplate])
  const trendingRibbonSelectedIndex = ref(0)
  const trendingRibbonEnum = ['day', 'week']
  const freeToWatchRibbonObj = reactive([objTemplate, objTemplate])
  const freeToWatchSelectedIndex = ref(0)
  const freeToWatchEnum = ['movie', 'tv']
  const test = ref()
  onBeforeMount(() => {
    store.resetStore()
    getArray(0)
    getTrendingList(0)
    getfreeToWatch(0)
  })

  async function getArray(index) {
    movieRibbonObj[index] = await store.getList(
      'movie',
      movieRibbonEnum[index],
      locale.value,
      1,
      locale.value.split('-')[1]
    )
    movieRibbonSelectedIndex.value = index
  }
  async function getTrendingList(index) {
    trendingRibbonObj[index] = await store.getTrendingList(
      'all',
      trendingRibbonEnum[index],
      locale.value
    )
    trendingRibbonSelectedIndex.value = index
  }
  async function getfreeToWatch(index) {
    let query = `include_adult=false&include_video=false&language=${
      locale.value
    }&page=1&sort_by=popularity.desc&with_watch_monetization_types=free&watch_region=${
      locale.value.split('-')[1]
    }`
    if (index === 1) {
      query += '&include_null_first_air_dates=false'
    }
    freeToWatchRibbonObj[index] = await store.Discover(freeToWatchEnum[index], query)
    freeToWatchSelectedIndex.value = index
  }
</script>

<template>
  <main>
    <div class="search"><search /></div>
    <section class="ribbons">
      <div>
        <ribbonComp
          :button-names="[t('Today'), t('This Week')]"
          :header="t('Trending')"
          :carosuelArray="trendingRibbonObj[trendingRibbonSelectedIndex].array"
          @which-one-selected="getTrendingList"
          class="ribbon" />
      </div>
      <div>
        <ribbonComp
          :button-names="[t('Streaming'), t('Popular'), t('Top Rated'), t('Up Coming')]"
          :header="'Movies'"
          :carosuelArray="movieRibbonObj[movieRibbonSelectedIndex].array"
          @which-one-selected="getArray"
          class="ribbon" />
      </div>

      <div>
        <ribbonComp
          :button-names="[t('Movies'), t('TV')]"
          :header="'Free To Watch'"
          :carosuelArray="freeToWatchRibbonObj[freeToWatchSelectedIndex].array"
          @which-one-selected="getfreeToWatch"
          class="ribbon"
          ref="test" />
      </div>
    </section>
  </main>
</template>
<style scoped>
  @media all and (min-width: 330px) {
    .ribbon {
      width: 330px;
    }
  }
  @media all and (min-width: 495px) {
    .ribbon {
      width: 495px;
    }
  }
  @media all and (min-width: 660px) {
    .ribbon {
      width: 660px;
    }
  }
  @media all and (min-width: 825px) {
    .ribbon {
      width: 825px;
    }
  }
  @media all and (min-width: 990px) {
    .ribbon {
      width: 990px;
      height: 500px;
    }
  }
  main {
    display: flex;
    flex-direction: column;
    row-gap: 40px;
    padding-top: 3.5em;
  }

  .search {
    width: 100%;
    height: auto;
  }
  .ribbons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 50px;
  }
</style>
