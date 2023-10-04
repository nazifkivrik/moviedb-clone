<script setup>
  import backToMain from '@/components/backToMain.vue'
  import subNavigationBar from '@/components/subNavigationBar.vue'
  import { useDbStore } from '@/stores/dbStore'
  import { storeToRefs } from 'pinia'
  const store = useDbStore()
  const { shared } = storeToRefs(store)
</script>

<template>
  <template v-if="shared">
    <subNavigationBar />
    <backToMain />
    <div class="seasonContainer">
      <ul>
        <li v-for="season in shared.seasons" :key="season">
          <app-link
            :to="{
              path: `/tv/${shared.id}/season/${season.season_number}`
            }">
            <img :src="store.imageURL('w130_and_h195_bestv2', season.poster_path)" alt=""
          /></app-link>

          <span class="info">
            <app-link
              :to="{
                path: `/tv/${shared.id}/season/${season.season_number}`
              }">
              <h2>{{ season.name }}</h2></app-link
            >

            <span class="vote" v-if="season.vote_average !== 0">
              <icon-lib icon="fa-solid fa-star" style="color: #ffffff" size="xs" />
              {{ Math.round(season.vote_average * 10) / 10 }}
            </span>
            <span class="airDate"
              >{{ season.air_date.split('-')[0] }} &#x2022;
              {{ season.episode_count }} Episodes</span
            >
            <p>
              Season {{ season.season_number }} of {{ shared.name }} premiered on
              {{ season.air_date }}
            </p>
            <p>{{ season.overview }}</p>
          </span>
        </li>
      </ul>
    </div>
  </template>
</template>

<style scoped lang="scss">
  .seasonContainer {
    padding-left: 50px;
    padding-top: 20px;
    ul {
      list-style: none;
      padding-inline-start: 0;
      display: flex;
      flex-direction: column;
      row-gap: 30px;

      li {
        display: flex;
        flex-direction: row;
        position: relative;
        min-width: 650px;
        max-width: 90%;
        border-radius: 15px;
        box-shadow:
          5px 5px 10px 0 #e3e3e3ff,
          -5px -5px 10px 0 #e3e3e3ff;
        img {
          border-radius: 15px;
        }
        .info {
          padding-left: 25px;
          padding-right: 30px;
          h2 {
            margin: 6px 0;
            font-size: 1.2em;
          }

          .vote {
            margin-left: 25px;
            margin-right: 10px;
            background-color: black;
            font-size: 0.7em;
            border-radius: 8px;
            padding: 5px;
            color: white;
          }
          .airDate {
            font-weight: 500;
            font-size: 0.9em;
          }

          p {
            font-size: 0.9em;
            @include line-clamp(4);
          }
        }
      }
    }
  }
</style>
