<script setup>
  import backToMain from '@/components/backToMain.vue'
  import subNavigationBar from '@/components/subNavigationBar.vue'
  import { useDbStore } from '@/stores/dbStore'
  import { onBeforeMount, ref } from 'vue'
  import { useRoute } from 'vue-router'
  const groupDetail = ref(null)
  const singleGroup = ref(null)
  const store = useDbStore()
  const route = useRoute()
  async function initialize() {
    groupDetail.value = await store.getTVEpisodeGroupsDetails(route.params.groupId)
    groupDetail.value.groups.forEach((element) => {
      if (element.id === route.query.group) {
        singleGroup.value = element
      }
    })
  }

  onBeforeMount(() => {
    initialize()
  })
</script>

<template>
  <subNavigationBar />
  <backToMain />
  <div class="groupDetails">
    <h3>{{ singleGroup.name }}({{ groupDetail.name }})</h3>
    <span>{{ singleGroup.episodes.length }} Episodes</span>
    <p>{{ groupDetail.description }}</p>
  </div>
  <div class="episodeContainer">
    <ul>
      <li v-for="episode in singleGroup.episodes" :key="episode">
        <span>
          <img :src="store.imageURL('w227_and_h127_bestv2', episode.still_path, 'tv')" alt="" />
        </span>
        <span class="info">
          <h3>{{ episode.episode_number }} {{ episode.name }}</h3>
          <span class="episodeNumber"
            >{{ episode.season_number }}x{{ episode.episode_number }}</span
          >
          <span class="vote">
            <icon-lib icon="fa-solid fa-star" style="color: #ffffff" size="xs" />
            {{ Math.round(episode.vote_average * 10) / 10 }}
          </span>
          <span class="airDate">{{ episode.air_date }} &#x2022; </span>
          <span class="runtime">{{ episode.runtime }}m</span>
          <p>{{ episode.overview }}</p>
        </span>
        <div class="expand">
          <span><icon-lib icon="fa-solid fa-caret-down" size="xs" />Expand</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
  .groupDetails {
    background-color: #f7f7f7ff;
    height: 120px;
    padding: 20px 0;
    padding-left: 80px;
    h3 {
      font-weight: 500;
      margin: 5px 0;
    }
    span {
      font-weight: 300;
    }
  }
  .episodeContainer {
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
          border-top-left-radius: 15px;
        }
        .info {
          padding-left: 25px;
          padding-right: 30px;
          h3 {
            margin: 6px 0;
          }
          .episodeNumber {
            background-color: #e5e5e5ff;
            padding: 3px;
            border-radius: 4px;
            font-size: 0.8em;
            position: absolute;
            right: 15px;
            top: 15px;
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
            font-weight: 300;
            font-size: 0.9em;
          }
          .runtime {
            font-weight: 300;
            font-size: 0.9em;
          }
          p {
            font-size: 0.9em;
          }
        }
        .expand {
          position: absolute;
          display: flex;
          flex-direction: row;
          justify-content: center;
          width: 100%;
          border: solid;
          border-width: 0.1px;
          border-color: #e3e3e3ff;
          bottom: -20px;
          height: 25px;
          background-color: white;
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
          span {
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
