<script setup>
  import { debounce } from 'lodash'
  import { onBeforeMount, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useDbStore } from '../stores/dbStore'
  const { t } = useI18n()
  const router = useRouter()
  const store = useDbStore()
  const randomMovie = ref(null)
  let randomNumber = Math.floor(Math.random() * 500)
  const previewItems = ref(null)
  const searchFocused = ref(false)
  const searchQuery = ref(null)
  async function initialize() {
    for (let index = 0; index < 5; index++) {
      let randomMedia = await store.Discover(
        'movie',
        `include_adult=false&include_video=false&language=${store.language}&page=${randomNumber}&sort_by=popularity.desc`
      )
      randomMovie.value = randomMedia.array[Math.round(Math.random() * 20)]
      if (randomMovie.value.backdrop_path) {
        break
      }
    }

    randomMovie.value.backdrop_path =
      'url(' +
      `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${randomMovie.value.backdrop_path}` +
      ')'
  }

  onBeforeMount(() => {
    initialize()
  })
  function search(query) {
    router.push({ path: '/search', query: { query, type: 'movie' } })
  }

  const debouncedPrew = debounce(async function preview(event) {
    let response = await store.searchMovie(event.target.value, store.language, '1')
    previewItems.value = await response.array
  }, 600)

  function liClick(id) {
    searchFocused.value = true
    router.push(`/movie/${id}`)
  }

  function focuslost() {
    setTimeout(() => {
      searchFocused.value = false
    }, 200)
  }
</script>

<template>
  <div
    class="searchSection"
    :style="{ 'background-image': randomMovie.backdrop_path }"
    v-if="randomMovie">
    <div class="content">
      <h1>{{ t('Welcome') }}</h1>
      <div class="motto">
        <h2>{{ t('Discover') }}</h2>

        <h3>
          <router-link :to="`/movie/${randomMovie.id}`">{{ t('Explore Now') }}</router-link>
        </h3>
      </div>

      <div class="innerSearchInput">
        <input
          type="text"
          class="search"
          :placeholder="t('Search Placeholder')"
          v-model="searchQuery"
          @keyup.enter="search(searchQuery)"
          @input="debouncedPrew"
          @focus="searchFocused = true"
          @keyup.esc="() => (searchFocused = false)"
          @blur="focuslost" />
        <button class="searchButton" @click="search(searchQuery)">{{ t('Search') }}</button>

        <div class="preview" v-if="previewItems">
          <ul class="previewContainer" :class="{ focused: searchFocused && previewItems.length }">
            <li
              v-for="previewItem in previewItems"
              :key="previewItem"
              @click="liClick(previewItem.id)">
              <span class="img">
                <img :src="store.imageURL('w92', previewItem.poster_path)" alt="" />
              </span>

              <span class="previewInfo"
                ><span class="previewTitle">{{ previewItem.original_title }}</span>
                <span class="previewRelDate">{{ previewItem.release_date }}</span>
                <p class="previewOverview">{{ previewItem.overview }}</p>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  $color_1: white;
  $color_2: brown;
  @media (orientation: landscape) {
    .searchSection {
      height: 50vh;
      .innerSearchInput {
        width: calc(70vw + 18px);
        .search {
          width: 70vw;
        }
      }
    }
  }
  @media (orientation: portrait) {
    .searchSection {
      height: 30vh;
      .innerSearchInput {
        width: calc(80vw + 18px);
        .search {
          width: 80vw;
        }
      }
    }
  }

  .searchSection {
    width: 100%;
    background-size: cover;
    background-blend-mode: color;
    display: flex;
    position: relative;
    z-index: 1;
    background-position: center;
    .content {
      display: flex;
      position: absolute;
      flex-direction: column;
      align-items: start;
      padding-top: 30px;
      padding-left: 10%;
    }
    &::before {
      content: '';

      background: #032541;
      width: 100%;
      opacity: 0.8;
    }
  }

  .motto {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;

    h2 {
      display: inline-flex;
      color: $color_1;
      width: max-content;
      align-items: center;
      margin: 0;
      font-size: 1em;
    }
    h3 {
      margin: 0;

      a {
        color: $color_2;
        font-size: 1.2em;
        display: inline-flex;
        width: max-content;
        text-decoration: underline;
        margin: 0;
      }
    }
  }

  h1 {
    font-size: 2em;
    display: block;
    color: $color_1;
  }

  .innerSearchInput {
    position: relative;
    display: flex;
    margin-top: 25px;

    .search {
      height: 2.4em;
      position: absolute;
      z-index: 1;
      left: 0;
      box-sizing: border-box;
      border-radius: 1.2em;

      border: none;
      padding-left: 15px;
      outline: none;
    }

    .searchButton {
      box-sizing: border-box;
      width: 4.5em;
      height: 2.4em;
      border-radius: 1.2em;
      position: absolute;
      z-index: 2;
      right: 0;
      border-style: none;
      background-image: linear-gradient(to right, #1bd2af, #03b6e0);
    }
  }

  .preview {
    height: 350px;
    width: 60vw;
    position: absolute;
    display: flex;
    flex-direction: row;
    top: 55px;
    left: 15px;
    border-radius: 10px;
    z-index: 100;
    visibility: hidden;
    overflow-x: none;

    .focused {
      visibility: visible;
      overflow-y: scroll;
    }

    .previewContainer {
      display: flex;
      flex-direction: column;
      list-style: none;
      background-color: white;
      padding-inline-start: 0;

      li {
        padding-left: 15px;
        height: 150px;
        width: max-content;
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 15px;
        cursor: pointer;

        &:hover {
          height: max-content;
          background-color: wheat;
        }

        img {
          width: 92px;
          height: 138px;
        }

        .previewInfo {
          display: flex;
          flex-direction: column;
          padding-left: 13px;
          overflow: hidden;

          .previewTitle {
            font-size: 1.1em;
            font-weight: 500;
          }

          .previewRelDate {
            font-weight: 300;
          }

          .previewOverview {
            margin-top: 3px;
            font-size: 0.8em;
            width: 49vw;
            text-overflow: clip;
          }
        }
      }
    }
  }
</style>
