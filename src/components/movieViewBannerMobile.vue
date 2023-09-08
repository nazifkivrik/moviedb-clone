<script setup>
  import { useDbStore } from '../stores/dbStore'
  import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import { onBeforeMount } from 'vue'
  import rate from '../components/rateChart.vue'
  const store = useDbStore()
  const { shared } = storeToRefs(store)
  function genreAndDuration(shared) {
    let text = ''
    let arr = new Array()
    shared.genres.map((element) => {
      arr.push(element.name)
    })
    if (shared.runtime) {
      text =
        Math.floor(shared.runtime / 60) + 'h' + (shared.runtime % 60) + 'm' + ' • ' + arr.toString()
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
  <template v-if="shared">
    <main>
      <div
        class="background"
        :style="{ 'background-image': shared.backdrop_path, '--bgColor': shared.color }">
        <div class="container">
          <span class="image">
            <img :src="store.imageURL('w92', shared.poster_path)" alt="" />
          </span>
          <div class="info">
            <!-- movie -->
            <h3 class="title" v-if="isMovie">{{ shared.original_title }}</h3>
            <!-- tv -->
            <h3 class="title" v-if="!isMovie">{{ shared.name }}</h3>
            <span class="rateandtrailer">
              <span class="rate">
                <rate
                  :popularity="Math.round(shared.vote_average * 10)"
                  style="height: 3.4em; width: 3.4em" />
                <span style="width: 40px">User Score</span>
              </span>
              <span class="trailer">Play Trailer</span>
            </span>

            <span class="genres" v-if="isMovie">
              {{ shared.release_date }} &bull; {{ genreAndDuration(shared) }}
            </span>
            <span class="genres" v-if="!isMovie">
              {{ genreAndDuration(shared) }}
            </span>

            <div class="tagline">{{ shared.tagline }}</div>
            <div class="overview">
              <h2>{{ $t('Overview') }}</h2>
              <p>{{ shared.overview }}</p>
            </div>
            <div class="crewContainer" v-if="isMovie">
              <div class="crew" v-for="(member, index) in shared.reduced" :key="index">
                <div class="crewName">{{ member.name }}</div>
                <div class="cewJob">{{ member.job.toString() }}</div>
              </div>
            </div>
            <div class="crewContainer" v-if="!isMovie">
              <div class="crew" v-for="(member, index) in shared.created_by" :key="index">
                <div>{{ member.name }}</div>
                <div>{{ $t('Creator') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </template>
</template>

<style scoped lang="scss">
  $color_1: white;
  $color_2: #b2a6b6;
  @media all and (max-width: 700px) {
    main {
      height: 70vh;
      .background {
        height: 50vh;
        background-size: 100% 50%;
        background-repeat: no-repeat;
        background-blend-mode: color;
        display: flex;
        position: relative;
        z-index: 10;

        &::before {
          content: '';
          height: 70vh;
          background: var(--bgColor);
          opacity: 0.9;
          position: absolute;
          right: 0;
          left: 0;
          z-index: 5;
        }
        .container {
          position: relative;
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-left: 1.2em;
          .image {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            width: 100%;
            align-items: flex-start;
            img {
              margin-top: 1.3em;
              border-radius: 10px;
            }
          }

          .info {
            color: $color_1;
            display: flex;
            margin-top: 8px;
            flex-direction: column;
            align-items: center;
            .title {
              font-size: 2em;
              font-weight: 500;
              margin: 5px 0;
            }
            .rateandtrailer {
              display: flex;
              flex-direction: row;
              width: 100%;
              align-items: baseline;
              justify-content: center;
              .rate {
                margin-left: 15px;
                span {
                  padding: 0 15px;
                  font-size: 1.5em;
                  border-right: solid;
                }
              }
              .trailer {
                font-size: 1.5em;
                padding: 0 15px;
              }
            }
            .genres {
              padding: 10px 5px;
              font-size: 1.5em;
            }
            .tagline {
              font-size: 1.3em;
              font-weight: 200;
            }
            .overview {
              h2 {
                font-size: 1.4em;
              }
              p {
                font-size: 1.1em;
              }
            }
            .crewContainer {
              width: 100%;
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
  }
</style>
