<script setup>
  import subNav from '../components/subNavigationBar.vue'
  import peopleCarosuel from '../components/peopleCarosuel.vue'
  import mediaCarosuel from '../components/mediaCarosuel.vue'
  import movieViewBanner from '../components/movieViewBanner.vue'
  import movieViewDetailed from '@/components/movieViewDetailedInfo.vue'
  import { useDbStore } from '../stores/dbStore'
  import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import AppLink from '../components/appLink.vue'
  const store = useDbStore()
  const { shared } = storeToRefs(store)

  const route = useRoute()
</script>

<template>
  <subNav />
  <main>
    <div class="player" v-if="route.query.name"><router-view></router-view></div>
    <movieViewBanner />
    <div class="detailedInfo" v-if="shared">
      <div class="whiteColumn">
        <peopleCarosuel :cast="shared.credits.cast" />

        <div class="showFullCast">
          <AppLink :to="`/${$route.params.type}/${$route.params.id}/cast`">{{
            $t('Full Cast&Crew')
          }}</AppLink>
        </div>
        <mediaCarosuel :movie="shared" />
      </div>
      <movieViewDetailed class="greyCol" />
    </div>
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
      .player {
        width: 100vw;
        height: 100vh;
        z-index: 1000;
        position: fixed;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(127, 127, 127, 0.95);
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
</style>
