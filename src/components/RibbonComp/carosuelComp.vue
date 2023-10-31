<script setup>
  import { useDbStore } from '../../stores/dbStore'
  import rate from '../rateChart.vue'
  import { toRefs } from 'vue'
  const props = defineProps({ carosuelArray: Array })
  const { carosuelArray } = toRefs(props)
  const store = useDbStore()
  function arrayCheck(obj) {
    if ('release_date' in obj) {
      return 'movie'
    } else if ('first_air_date' in obj) {
      return 'tv'
    } else return 'person'
  }
</script>

<template>
  <div class="carosuel" v-if="carosuelArray.length">
    <div v-for="(i, index) in carosuelArray" :key="index" class="card">
      <div class="imageArea">
        <router-link
          :to="{
            name: 'media',
            params: {
              type: arrayCheck(carosuelArray[index]),
              id: carosuelArray[index].id
            }
          }"
          ><img
            :src="store.imageURL('w220_and_h330_face', carosuelArray[index].poster_path)"
            alt=""
            v-lazy-load
        /></router-link>

        <rate :popularity="Math.round(carosuelArray[index].vote_average * 10)" class="rate" />
      </div>

      <div class="content">
        <div class="title">
          <h4 v-if="carosuelArray[index].title">
            <router-link
              :to="{
                name: 'media',
                params: {
                  type: 'movie',
                  id: carosuelArray[index].id
                }
              }"
              >{{ carosuelArray[index].title }}</router-link
            >
          </h4>
          <h4 v-if="carosuelArray[index].name">
            <router-link
              :to="{
                name: 'media',
                params: {
                  type: 'tv',
                  id: carosuelArray[index].id
                }
              }"
              >{{ carosuelArray[index].name }}</router-link
            >
          </h4>
        </div>
        <div class="releaseDate">
          <h5 v-if="carosuelArray[index].release_date">
            {{ $d(carosuelArray[index].release_date, 'short') }}
          </h5>
          <h5 v-if="carosuelArray[index].first_air_date">
            {{ $d(carosuelArray[index].first_air_date, 'short') }}
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @media all and (max-width: 750px) {
    .carosuel {
      height: 30em;
    }

    .rate {
      width: 3.4em;
      height: 3.4em;
    }
  }
  @media all and (min-width: 751px) {
    .carosuel {
      height: 23em;
    }
    .rate {
      width: 2.2em;
      height: 2.2em;
    }
  }
  .carosuel {
    display: inline-flex;
    overflow-x: scroll;
    overflow-y: hidden;
  }

  .card {
    margin-left: 11px;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .rate {
    display: inline;
    position: absolute;
    top: 210px;
    left: 10px;

    z-index: 50;
  }

  img {
    border-radius: 12px;
    width: 154px;
    height: 230px;
  }

  .title {
    margin-top: 1em;
    margin-bottom: 5px;
  }

  .title h4 {
    margin: 0;
    text-align: center;
    font-weight: 500;
  }

  .releaseDate h5 {
    margin: 0;
    font-weight: 300;
  }

  .content {
    width: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: end;
    flex-wrap: wrap;
  }
</style>
