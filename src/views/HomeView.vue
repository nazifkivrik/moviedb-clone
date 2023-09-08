<script setup>
  import { onBeforeMount } from 'vue'
  import { useI18n } from 'vue-i18n'
  import search from '../components/SearchArea.vue'
  import ribbonComp from '../components/RibbonComp/ribbonComp.vue'
  import { useDbStore } from '../stores/dbStore'
  const store = useDbStore()
  const { t } = useI18n()
  onBeforeMount(() => {
    store.resetStore()
    store.getList()
  })
</script>

<template>
  <div class="search"><search /></div>
  <section class="ribbons">
    <ribbonComp
      :button-names="[t('Today'), t('This Week')]"
      :header="t('Trending')"
      :list="store.trendingLists.All"
      class="ribbon" />
    <ribbonComp
      :button-names="[t('Streaming'), t('Popular'), t('Top Rated'), t('Up Coming')]"
      :header="'Movies'"
      :list="store.movieLists"
      class="ribbon" />
  </section>
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
    }
  }
  .search {
    width: 100%;
  }
  .ribbons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
