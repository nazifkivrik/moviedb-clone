<script setup>
  import AppLink from '@/components/appLink.vue'
  import mediaCarosuel from '@/components/mediaCarosuel.vue'
  import movieViewBanner from '@/components/movieViewBanner.vue'
  import movieViewDetailed from '@/components/movieViewDetailedInfo.vue'
  import peopleCarosuel from '@/components/peopleCarosuel.vue'
  import subNav from '@/components/subNavigationBar.vue'
  import { useDbStore } from '@/stores/dbStore'
  import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import { onBeforeMount } from 'vue'
  import { SortBy, GroupBy } from '@/utils/functions'

  const store = useDbStore()
  const { shared } = storeToRefs(store)
  const route = useRoute()
  async function initialize() {
    if (!store.shared) {
      await store.getShared(route.params.type, route.params.id, localStorage.getItem('language'))
    }

  }
  onBeforeMount(() => {
    initialize()
  })
</script>

<template>
  <subNav />
  <main>
    <template v-if="shared">
      <div class="player" v-if="route.query.name"><router-view></router-view></div>
      <movieViewBanner />
      <div class="detailedInfo">
        <div class="whiteColumn">
          <peopleCarosuel :cast="shared.credits.cast" />

          <div class="showFullCast">
            <AppLink :to="`/${$route.params.type}/${$route.params.id}/cast`">{{
              $t('Full Cast&Crew')
            }}</AppLink>
          </div>
          <mediaCarosuel />
        </div>
        <movieViewDetailed class="greyCol" />
      </div>
    </template>
  </main>
</template>

<style scoped>
  @media all and (min-width: 1160px) {
    .whiteColumn {
      width: 900px;
    }
  }
  @media all and (max-width: 1160px) {
    .whiteColumn {
      width: 750px;
    }
  }
  @media all and (max-width: 1010px) {
    .whiteColumn {
      width: 600px;
    }
  }
  @media all and (min-width: 701px) {
    main {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      .detailedInfo {
        padding-top: 20px;
        position: relative;
        display: flex;
        justify-content: center;
        column-gap: 50px;
      }

      /*whiteColumn*/

      .showFullCast {
        margin-top: 20px;
        font-size: 1.2em;
        border-bottom: solid;
        border-width: 1px;
        padding-bottom: 15px;
        font-weight: bold;
        margin-left: 25px;
      }
    }
  }
  @media all and (max-width: 700px) {
    main {
      display: flex;
      flex-direction: column;
      .detailedInfo {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        row-gap: 15px;

        .whiteColumn {
          width: 100%;
          left: 0;
        }
      }
    }
  }
  .player {
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(127, 127, 127, 0.95);
  }
</style>
