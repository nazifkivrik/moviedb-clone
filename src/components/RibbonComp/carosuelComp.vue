<script setup>
  import rate from '../rateChart.vue'
  import { toRefs, watch, ref, onMounted } from 'vue'
  const props = defineProps({ carosuelArray: Array })
  const { carosuelArray } = toRefs(props)
  const slider = ref(null)
  const renderCount = ref(8)
  function arrayCheck(obj) {
    if ('release_date' in obj) {
      return 'movie'
    } else if ('first_air_date' in obj) {
      return 'tv'
    } else return 'person'
  }
  //lazyload------------
  const throttle = (callback, delay) => {
    let throttleTimeout = null
    let storedEvent = null

    const throttledEventHandler = (event) => {
      storedEvent = event

      const shouldHandleEvent = !throttleTimeout

      if (shouldHandleEvent) {
        callback(storedEvent)

        storedEvent = null

        throttleTimeout = setTimeout(() => {
          throttleTimeout = null

          if (storedEvent) {
            throttledEventHandler(storedEvent)
          }
        }, delay)
      }
    }

    return throttledEventHandler
  }
  let lazyLoad = throttle(function (event) {
    if (
      renderCount.value <
      Math.round((event.srcElement.offsetWidth + event.srcElement.scrollLeft) / 150)
    ) {
      renderCount.value = Math.round(
        (event.srcElement.offsetWidth + event.srcElement.scrollLeft) / 150
      )
    }
  }, 250)
  //------------------------

  //scroll default position
  watch(carosuelArray, defaultPos)
  function defaultPos() {
    slider.value.scrollLeft = 0
    renderCount.value = 8
  }
  //-------------------------
  onMounted(() => {
    renderCount.value = Math.round((slider.value.offsetWidth + slider.value.scrollLeft) / 150)
  })
</script>

<template>
  <div
    class="carosuel"
    @scroll="(event) => lazyLoad(event)"
    v-if="carosuelArray.length"
    ref="slider">
    <div v-for="(i, index) in carosuelArray" :key="index" class="card">
      <div class="imageArea" v-if="index <= renderCount">
        <router-link :to="`/${arrayCheck(carosuelArray[index])}/${carosuelArray[index].id}`"
          ><img :src="`https://image.tmdb.org/t/p/w154${carosuelArray[index].poster_path}`" alt=""
        /></router-link>

        <rate :popularity="Math.round(carosuelArray[index].vote_average * 10)" class="rate" />
      </div>

      <div class="content">
        <div class="title">
          <h4 v-if="carosuelArray[index].original_title">
            <router-link :to="`/movie/${carosuelArray[index].id}`">{{
              carosuelArray[index].original_title
            }}</router-link>
          </h4>
          <h4 v-if="carosuelArray[index].name">
            <router-link :to="`/tv/${carosuelArray[index].id}`">{{
              carosuelArray[index].name
            }}</router-link>
          </h4>
        </div>
        <div class="releaseDate">
          <h5 v-if="carosuelArray[index].release_date">
            {{
              new Date(carosuelArray[index].release_date).toLocaleDateString('en-us', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })
            }}
          </h5>
          <h5 v-if="carosuelArray[index].first_air_date">
            {{
              new Date(carosuelArray[index].first_air_date).toLocaleDateString('en-us', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })
            }}
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @media all and (max-width: 800px) {
    .carosuel {
      height: 30em;
    }

    .rate {
      width: 3.4em;
      height: 3.4em;
    }
  }
  @media all and (min-width: 800px) {
    .carosuel {
      height: 20em;
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
