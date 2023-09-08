<script setup>
  import { useDbStore } from '../stores/dbStore'
  import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import { onBeforeMount, ref } from 'vue'
  import rate from '../components/rateChart.vue'
  const isMobile = ref(window.innerWidth)
  const store = useDbStore()
  import movieViewBannerMobile from '@/components/movieViewBannerMobile.vue'
  const { shared } = storeToRefs(store)
  function genreAndDuration(shared) {
    let text = ''
    let arr = new Array()
    shared.genres.map((element) => {
      arr.push(element.name)
    })
    if (shared.runtime) {
      text =
        arr.toString() + ' • ' + Math.floor(shared.runtime / 60) + 'h' + (shared.runtime % 60) + 'm'
    } else {
      text = arr.toString()
    }
    return text
  }
  const route = useRoute()
  let isMovie

  onBeforeMount(() => {
    if (route.params.type === 'movie') {
      isMovie = true
    } else {
      isMovie = false
    }
  })
</script>

<template>
  <main v-if="isMobile >= 700">
    <div
      class="background"
      :style="{ 'background-image': shared.backdrop_path, '--bgColor': shared.color }"
      v-if="shared">
      <div class="container">
        <img :src="store.imageURL('w342', shared.poster_path)" alt="" />
        <div class="info">
          <!-- movie -->
          <h3 class="title" v-if="isMovie">{{ shared.original_title }}</h3>
          <!-- tv -->
          <h3 class="title" v-if="!isMovie">{{ shared.name }}</h3>
          <span class="genres" v-if="isMovie">
            {{ shared.release_date }} &bull; {{ genreAndDuration(shared) }}
          </span>
          <span class="genres" v-if="!isMovie">
            {{ genreAndDuration(shared) }}
          </span>
          <div class="rate">
            <rate
              :popularity="Math.round(shared.vote_average * 10)"
              style="height: 3em; width: 3em" />
            <span style="width: 40px">User Score</span>
          </div>

          <div class="tagline">{{ shared.tagline }}</div>
          <h2>{{ $t('Overview') }}</h2>
          <p>{{ shared.overview }}</p>
          <div class="crewContainer" v-if="isMovie">
            <div class="crew" v-for="(member, index) in shared.reduced" :key="index">
              <div class="crewName">{{ member.name }}</div>
              <div class="cewJob">{{ member.job.toString() }}</div>
            </div>
          </div>
          <div class="crewContainer" v-if="!isMovie">
            <div class="crew" v-for="(member, index) in shared.created_by" :key="index">
              <div class="crewName">{{ member.name }}</div>
              <div class="cewJob">{{ $t('Creator') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <main v-if="isMobile < 700">
    <movieViewBannerMobile />
  </main>
</template>

<style scoped lang="scss">
  $color_1: white;
  $color_2: #b2a6b6;

  @media all and (min-width: 701px) {
    main {
      .background {
        height: 600px;

        background-size: cover;
        background-blend-mode: color;
        display: flex;
        justify-content: center;
        position: relative;
        z-index: 10;

        &::before {
          content: '';
          background: var(--bgColor);
          opacity: 0.8;
          position: absolute;
          right: 0;
          left: 0;
          z-index: 5;
          height: 600px;
        }
      }
      .container {
        z-index: 20;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 4em;

        img {
          border-radius: 10px;
        }

        .info {
          margin-left: 4em;
          color: $color_1;

          font-size: 1.2em;
          display: flex;
          flex-direction: column;
          justify-content: center;
          h2 {
            font-size: 1.3em;
          }
          .title {
            font-size: 2em;
            width: max-content;
            margin: 0;
          }
          .genres {
            font-size: 1em;
            font-weight: 300;
            display: block;
            width: max-content;
          }
          .rate {
            margin-top: 20px;
            display: inline-flex;
            width: 6em;
            justify-content: space-between;
            align-items: center;
          }
          .tagline {
            display: block;
            color: $color_2;
            margin-top: 1.3em;
          }
          .crewContainer {
            display: grid;
            grid-template-columns: repeat(3, 3fr);
            grid-template-rows: max-content;
            column-gap: 0.8em;
            row-gap: 3.3em;
          }
          .crew {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
      }
    }
  }
</style>
