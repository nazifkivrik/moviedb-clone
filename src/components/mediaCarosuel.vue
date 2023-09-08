<script setup>
  import { toRefs, ref, onMounted } from 'vue'
  import { useDbStore } from '../stores/dbStore'
  import applink from './appLink.vue'
  const store = useDbStore()
  const props = defineProps({ movie: Object })
  const { movie } = toRefs(props)
  const selectedSection = ref(0)
  const headArray = ['Most Popular', 'Videos', 'Backdrops', 'Posters']

  function getFirstTen(arr) {
    if (arr.length >= 10) return 10
    else return arr.length - 1
  }
  onMounted(() => {})
</script>

<template>
  <div class="mediaSection" v-if="movie !== undefined">
    <div class="mediaMenus">
      <div class="mediaHeader">{{ $t('Media') }}</div>
      <div v-for="(head, index) in headArray" :key="index">
        <input
          type="button"
          :class="[selectedSection === head ? 'selectedButton' : '']"
          :value="$t(headArray[index])"
          @click="(event) => (selectedSection = index)"
          class="mediaHeaderItem" />
        <div class="count" v-if="index == 1">{{ movie.videos.length }}</div>
        <div class="count" v-if="index == 2 && movie.backdrops">
          {{ movie.backdrops.length }}
        </div>
        <div class="count" v-if="index == 3 && movie.backdrops">
          {{ movie.posters.length }}
        </div>
      </div>

      <div class="viewAllButton" v-if="selectedSection !== 0">
        <app-link
          :to="`/${$route.params.type}/${$route.params.id}/images/${headArray[
            selectedSection
          ].toLowerCase()}`">
          {{ $t('View All') }} {{ $t(headArray[selectedSection]) }}
        </app-link>
      </div>
    </div>

    <div class="mediaContainer">
      <div class="mostPopular" v-if="selectedSection == 0 && movie.posters && movie.backdrops">
        <applink
          :to="{
            path: `/movie/${movie.id}/player`,
            query: {
              key: movie.videos[movie.videos.length - 1].key,
              name: movie.videos[movie.videos.length - 1].name
            }
          }">
          <div class="videoPkg">
            <img
              :src="`https://i.ytimg.com/vi/${
                movie.videos[movie.videos.length - 1].key
              }/maxresdefault.jpg`"
              alt="" />
            <div class="play"><icon-lib icon="fa-regular fa-circle-play" size="xl" /></div>
          </div>
        </applink>
        <img :src="store.imageURL('w780', movie.backdrops[0].file_path)" alt="" />
        <img :src="store.imageURL('w500', movie.posters[0].file_path)" alt="" />
      </div>
      <div class="videos" v-if="selectedSection == 1">
        <div class="video" v-for="index in getFirstTen(movie.videos)" :key="index">
          <applink
            :to="{
              path: `/movie/${movie.id}/player`,
              query: { key: movie.videos[index].key, name: movie.videos[index].name }
            }">
            <div class="videoPkg">
              <img
                :src="`https://i.ytimg.com/vi/${movie.videos[index].key}/maxresdefault.jpg`"
                alt="" />
              <div class="play"><icon-lib icon="fa-regular fa-circle-play" size="xl" /></div>
            </div>
          </applink>
        </div>
      </div>

      <div class="backdrops" v-if="selectedSection == 2">
        <div class="backdrop" v-for="index in getFirstTen(movie.backdrops)" :key="index">
          <img :src="store.imageURL('w500', movie.backdrops[index].file_path)" alt="" />
        </div>
      </div>
      <div class="posters" v-if="selectedSection == 3">
        <div class="poster" v-for="index in getFirstTen(movie.posters)" :key="index">
          <img :src="store.imageURL('w500', movie.posters[index].file_path)" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  $color_1: gray;
  $color_2: white;
  $color_3: black;
  $background-color_1: white;
  $background-color_2: rgba(187, 182, 182, 0.1);

  @media all and (max-width: 750px) {
    .viewAllButton {
      position: absolute;
      right: 5px;
      bottom: -10px;
    }
  }

  @media all and (min-width: 751px) {
    .viewAllButton {
      position: absolute;
      right: 5px;
    }
  }
  .mediaSection {
    position: relative;
    .mediaMenus {
      list-style: none;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-weight: bold;
      margin: 1em 0;
      column-gap: 1em;
      .mediaHeader {
        font-size: 1.25em;
        padding-right: 1em;
        border-right: solid;
      }
      .mediaHeaderItem {
        background-color: white;
        border: none;
        font-size: 1.1em;
        font-weight: 500;
        cursor: pointer;
      }
      .count {
        position: absolute;
        font-weight: 400;
        display: inline;
        color: $color_1;
      }
      .viewAllButton {
        font-weight: 400;
        font-size: 0.8em;
        text-decoration: underline;
        cursor: pointer;
        justify-self: flex-end;
      }
    }
    .mediaContainer {
      padding: 10px 0;
      img {
        height: 30vh;
      }
    }
  }

  .selectedButton {
    border-bottom: solid;
    border-width: 3px;
  }

  .mostPopular {
    display: flex;
    overflow-x: scroll;
    column-gap: 15px;
  }
  .videos {
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    column-gap: 15px;
    scroll-behavior: smooth;
    scroll-snap-align: end;
  }
  .backdrops {
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    column-gap: 15px;
    scroll-behavior: smooth;
    scroll-snap-align: end;
  }
  .posters {
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    column-gap: 15px;
    scroll-behavior: smooth;
    scroll-snap-align: end;
  }
  .videoPkg {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .play {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color_2;
    z-index: 100;
    &:hover {
      color: $color_3;
    }
    &:before {
      content: '';
      position: absolute;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: $background-color_2;
    }
  }
</style>
