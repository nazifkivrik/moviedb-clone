<script setup>
  import discoverOptions from '../components/discoverMovieOptions.vue'
  import { useDbStore } from '@/stores/dbStore.js'
  import rateChart from '@/components/rateChart.vue'
  import { useRouter, useRoute } from 'vue-router'

  import { inject, ref, onMounted, onUnmounted, computed, watch } from 'vue'
  import { debounce } from 'lodash'
  const router = useRouter()
  const route = useRoute()
  const backToTopButton = ref()
  let fetchText = ''
  let currentPage
  let totalPage
  const isMobile = computed(() => {
    if (window.innerWidth > 750) {
      return false
    } else {
      return true
    }
  })
  const store = useDbStore()
  const options = inject('fetchOptions')
  const discovered = ref()

  async function discover(discoverOptions) {
    let text = ''
    text = text + 'include_adult=false'
    if (discoverOptions.Language.iso_3166_1 != '') {
      text += '&language=' + discoverOptions.Language.iso_3166_1
    }
    ;('https://api.themoviedb.org/3/discover/movie?include_adult=false&sort_by=popularity.desc&region=TR&with_runtime.gte=0&with_runtime.lte=400&vote_average.lte=10&vote_average.gte=0&release_date.gte=2023-08-16&release_date.lte=2023-09-26&with_release_type=2')

    if (discoverOptions.Keywords.length > 0) {
      text = text + '&with_keywords=' + discoverOptions.Keywords.toString()
    }
    text = text + '&sort_by=' + discoverOptions.SortOpt.text
    if (discoverOptions.Region !== null) {
      text = text + '&watch_region=' + discoverOptions.Region.iso_3166_1
    }
    if (!discoverOptions.SearchAllCountries) {
      text = text + '&with_origin_country=' + discoverOptions.Country.iso_3166_1
    }
    if (discoverOptions.MinimumUserVotes !== 0) {
      text = text + '&vote_count.gte=' + discoverOptions.MinimumUserVotes
    }
    text = text + '&with_runtime.gte=' + discoverOptions.Runtime.min
    text = text + '&with_runtime.lte=' + discoverOptions.Runtime.max
    text = text + '&vote_average.lte=' + discoverOptions.UserScore.max
    text = text + '&vote_average.gte=' + discoverOptions.UserScore.min
    if (discoverOptions.DateFrom) {
      text = text + '&release_date.gte=' + discoverOptions.DateFrom
    }
    if (discoverOptions.DateTo) {
      text = text + '&release_date.lte=' + discoverOptions.DateTo
    }
    if (discoverOptions.Genres.length > 0) {
      text = text + '&with_genres=' + discoverOptions.Genres.toString()
    }
    if (discoverOptions.WatchProviders.length > 0) {
      text = text + '&with_watch_providers=' + discoverOptions.WatchProviders.toString()
    }
    if (discoverOptions.Releases.length > 0) {
      let releases = ''
      discoverOptions.Releases.forEach((item) => {
        if (discoverOptions.Releases.indexOf(item) !== discoverOptions.Releases.length - 1) {
          releases = releases + item + '|'
        } else {
          releases = releases + item
        }
      })
      text = text + '&with_release_type=' + releases
    }
    if (discoverOptions.Availabilities.length > 0) {
      let availabilitiesText = ''

      discoverOptions.Availabilities.forEach((item) => {
        if (
          discoverOptions.Availabilities.indexOf(item) !==
          discoverOptions.Availabilities.length - 1
        ) {
          availabilitiesText = availabilitiesText + item.toLowerCase() + '|'
        } else {
          availabilitiesText = availabilitiesText + item.toLowerCase()
        }
      })
      availabilitiesText = availabilitiesText.replace('stream', 'flatrate')

      text = text + '&with_watch_monetization_types=' + availabilitiesText
    }
    console.log(text)
    fetchText = text
    try {
      const response = await fetch('https://api.themoviedb.org/3/discover/movie?' + text, options)
      const data = await response.json()
      currentPage = data.page
      totalPage = data.total_results
      discovered.value = data.results
    } catch (error) {
      console.log(error)
    }
  }

  const getDiscoverPagesDebounce = debounce(async function getDiscoverPagesLazy(e) {
    if (window.screen.availHeight - e.target.scrollingElement.scrollTop >= 0) {
      backToTopButton.value = false
    } else {
      backToTopButton.value = true
    }
    if (
      e.target.scrollingElement.scrollHeight - e.target.scrollingElement.scrollTop <
      window.outerHeight * 1.8
    ) {
      if (currentPage < totalPage) {
        let newPage
        fetchText = fetchText + '&page=' + (currentPage + 1)
        const response = await fetch(
          'https://api.themoviedb.org/3/discover/movie?' + fetchText,
          options
        )
        const data = await response.json()
        currentPage = data.page
        totalPage = data.total_results
        newPage = data.results
        newPage.forEach((item) => discovered.value.push(item))
      }
    }
  }, 200)
  onMounted(() => {
    window.addEventListener('scroll', getDiscoverPagesDebounce)
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', getDiscoverPagesDebounce)
  })
  function backToTop() {
    window.scrollTo({ top: document.documentElement.offsetTop, behavior: 'smooth' })
  }
  watch(
    () => route.query.query,
    () => router.go(0)
  )
</script>

<template>
  <main>
    <div class="options"><discoverOptions @discover="discover" /></div>
    <div class="container">
      <ul>
        <li v-for="item in discovered" :key="item">
          <app-link :to="`/movie/${item.id}`"
            ><img
              :src="store.imageURL('w220_and_h330_face', item.poster_path)"
              alt=""
              loading="lazy"
              v-if="item.poster_path && !isMobile" />
            <img
              :src="store.imageURL('w92', item.poster_path)"
              alt=""
              loading="lazy"
              v-else-if="item.poster_path && isMobile" />
            <img
              src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg"
              alt=""
              loading="lazy"
              v-else
          /></app-link>
          <span class="rate" v-if="!isMobile">
            <rateChart :popularity="item.vote_average * 10" style="width: 40px; height: 40px" />
          </span>
          <span class="info">
            <app-link :to="`/movie/${item.id}`">{{ item.title }}</app-link>
            <h4>{{ item.release_date }}</h4>
            <app-link :to="`/movie/${item.id}`" v-if="isMobile">
              <p>{{ item.overview }}</p></app-link
            >
          </span>
        </li>
      </ul>
    </div>
    <transition name="fade">
      <button v-if="backToTopButton" @click="backToTop">
        <icon-lib icon="fa-angles-up" size="2xl"></icon-lib>
      </button>
    </transition>
  </main>
</template>

<style scoped lang="scss">
  .fade-enter-from {
    opacity: 0;
  }

  .fade-enter-active {
    transition: all 1s ease;
  }

  .fade-leave-to {
    opacity: 0;
  }
  .fade-leave-active {
    transition: all 1s ease;
  }
  @media all and (max-width: 750px) {
    main {
      display: flex;
      flex-direction: column;
      align-items: center;
      .options {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
      }
      .container {
        ul {
          list-style: none;
          padding-inline-start: 0;
          display: flex;

          flex-direction: column;
          row-gap: 15px;

          li {
            display: flex;
            flex-direction: row;
            padding: 0px 5px;
            height: 140px;
            box-shadow:
              5px 5px 10px 0 #f3f3f3,
              -5px -5px 10px 0 #f3f3f3;
            img {
              width: 92px;
              border-top-left-radius: 15px;
              border-bottom-left-radius: 15px;
            }

            .info {
              display: flex;
              align-items: flex-start;
              flex-direction: column;
              padding: 15px 0 0 8px;
              overflow: hidden;
              a {
                font-size: 1.3em;
                font-weight: 500;
                p {
                  font-size: 0.7em;
                  font-weight: 300;
                  @include line-clamp(6);
                }
              }
              h4 {
                font-weight: 300;
                margin: 0;
              }
            }
          }
        }
      }
      button {
        position: fixed;
        right: 50%;
        bottom: 10px;
        background-color: transparent;
        border: none;
        cursor: pointer;
      }
    }
  }
  @media all and (min-width: 751px) {
    main {
      display: flex;
      flex-direction: row;

      .options {
        display: flex;
        margin-left: 70px;
        margin-top: 50px;
        height: 100vh;
        width: 450px;
      }
      .container {
        padding-left: 70px;
        padding-top: 50px;
        width: 70%;
        ul {
          list-style: none;
          padding-inline-start: 0;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          row-gap: 25px;
          column-gap: 35px;
          li {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            box-shadow:
              5px 5px 10px 0 #f3f3f3,
              -5px -5px 10px 0 #f3f3f3;
            width: 180px;
            height: 400px;
            img {
              width: 180px;
              height: 273px;
              border-top-left-radius: 15px;
              border-top-right-radius: 15px;
            }
            .rate {
              position: absolute;
              left: 10px;
              top: 253px;
            }
            .info {
              display: flex;
              align-items: flex-start;
              flex-direction: column;
              padding: 18px 5px 0 8px;
              a {
                font-size: 1.1em;
                font-weight: 500;
              }
              h4 {
                font-weight: 300;
                margin: 0;
              }
            }
          }
        }
      }
      button {
        position: fixed;
        right: 45px;
        bottom: 45px;
        background-color: transparent;
        border: none;
        cursor: pointer;
      }
    }
  }
</style>
