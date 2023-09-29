<script setup>
  import { useRoute } from 'vue-router'
  import { useDbStore } from '@/stores/dbStore'
  import subNav from '@/components/subNavigationBar.vue'
  import backToMain from './backToMain.vue'
  import { toRefs, computed, ref, onBeforeMount, watch } from 'vue'
  const youtubeDetails = ref(null)
  const route = useRoute()
  const store = useDbStore()
  const { shared } = toRefs(store)
  const filteredVideos = computed(() => {
    if (shared.value) {
      return filterByVideoType(shared.value.videos)
    } else return null
  })
  const text = computed(() => {
    if (shared.value) {
      return youtubeIdText(shared.value.videos)
    } else return null
  })
  function filterByVideoType(array) {
    let reduced = array.reduce((obj, item) => {
      if (obj[item.type]) {
        obj[item.type].push(item)
      } else {
        obj[item.type] = [item]
      }
      return obj
    }, {})
    return reduced
  }
  function youtubeIdText(videoArr) {
    let text = '&'
    videoArr.forEach((item) => {
      text = text + `id=${item.key}&`
    })
    return text
  }
  async function getYoutubeDetails(text) {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails${text}key=AIzaSyBxAhdYttCBLgGAr-r_s-D535sC9hgoI7o`
    )
    const data = await response.json()
    youtubeDetails.value = data
  }

  function iso8601(duration) {
    let hour, minute, second
    if (duration.includes('H')) {
      hour = duration.substring(duration.indexOf('T') + 1, duration.indexOf('H'))
      minute = duration.substring(duration.indexOf('H') + 1, duration.indexOf('M'))
      second = duration.substring(duration.indexOf('M') + 1, duration.indexOf('S'))

      return hour + ':' + minute + ':' + second
    } else if (!duration.includes('H') && duration.includes('M')) {
      minute = duration.substring(duration.indexOf('T') + 1, duration.indexOf('M'))
      second = duration.substring(duration.indexOf('M') + 1, duration.indexOf('S'))
      return minute + ':' + second
    } else {
      second = duration.substring(duration.indexOf('T') + 1, duration.indexOf('S'))
      return '0:' + second
    }
  }
  watch(
    () => youtubeDetails.value,
    () => {
      for (let index = 0; index < youtubeDetails.value.items.length; index++) {
        if (shared.value.videos[index].key === youtubeDetails.value.items[index].id) {
          shared.value.videos[index].youtubeDetails = youtubeDetails.value.items[index]
        }
      }
    }
  )
  watch(
    () => text.value,
    () => getYoutubeDetails(text.value)
  )
  onBeforeMount(() => {})
</script>

<template>
  <subNav />
  <backToMain />
  <div class="player" v-if="route.query.name"><router-view></router-view></div>
  <template v-if="shared">
    <div class="videoSide">
      <div class="videoSum">
        <h2 :style="{ 'background-color': shared.color }">
          Videos <span class="videoCount">{{ shared.videos.length }}</span>
        </h2>
        <ul>
          <li
            v-for="(type, key) in filteredVideos"
            :key="type"
            :class="{ selectedClass: key === route.query.selectedType }">
            <app-link
              :to="{
                path: '/' + route.params.type + '/' + route.params.id + '/' + 'videos',
                query: { selectedType: key }
              }"
              >{{ key }}</app-link
            >
            <span class="videoCount">{{ type.length }}</span>
          </li>
        </ul>
      </div>

      <div v-for="(videos, key) in filteredVideos" :key="key" class="videoContainer">
        <template v-if="key === route.query.selectedType">
          <template v-for="video in videos" :key="video">
            <div class="videoDetails">
              <app-link
                :to="{
                  path: `/movie/${route.params.id}/videos/player`,
                  query: { key: video.key, name: video.name }
                }">
                <div class="videoPkg">
                  <img :src="`https://i.ytimg.com/vi/${video.key}/maxresdefault.jpg`" alt="" />
                  <div class="play"><icon-lib icon="fa-regular fa-circle-play" size="xl" /></div>
                </div>
              </app-link>
              <div class="details" v-if="video.youtubeDetails">
                <h4>{{ video.name }}</h4>
                <div>
                  <p>{{ video.type }} &#x2022;</p>
                  <p>{{ iso8601(video.youtubeDetails.contentDetails.duration) }} &#x2022;</p>
                  <p>
                    {{
                      new Date(video.youtubeDetails.snippet.publishedAt).toLocaleDateString(
                        'en-us',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }
                      )
                    }}
                  </p>
                </div>
                <div class="description">
                  Description
                  <span class="tooltip">{{ video.youtubeDetails.snippet.description }}</span>
                </div>
                <div class="channel">{{ video.youtubeDetails.snippet.channelTitle }}</div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </template>
</template>
<style scoped lang="scss">
  $color_1: white;
  $color_2: black;
  $background-color_1: #ebebeb;
  $background-color_2: antiquewhite;
  $background-color_3: rgba(187, 182, 182, 0.1);
  $background-color_4: rgba(127, 127, 127, 0.95);
  @media all and (max-width: 750px) {
    .videoSide {
      display: flex;
      flex-direction: column;
      .videoSum {
        h2 {
          color: white;
          position: relative;
          font-size: 1.7em;
          margin: 0;
          padding: 5px 20px;
          display: flex;
          align-items: center;
          .videoCount {
            position: absolute;
            font-weight: 300;
            right: 30px;
          }
        }
        ul {
          list-style: none;
          padding-inline-start: 0;
          display: flex;
          flex-direction: row;
          overflow-x: scroll;
          column-gap: 0.8em;
          box-shadow:
            5px 5px 5px 0 rgba(0, 0, 0, 0.1),
            -5px -5px 5px 0 rgba(0, 0, 0, 0.1);
          .videoCount {
            position: absolute;
            font-weight: 300;
            right: 0;
          }

          li {
            position: relative;
            padding: 5px 15px;
            height: 1.2em;
            box-shadow: 5px 5px 5px 0 rgba(0, 0, 0, 0.1);
          }
          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
    }
  }
  @media all and (min-width: 751px) {
    .videoSide {
      display: flex;
      flex-direction: row;
    }
    .videoSum {
      margin-left: 40px;
      margin-top: 30px;
      width: 210px;
      position: relative;
      h2 {
        width: 210px;
        padding: 12px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        color: $color_1;
        font-weight: 500;
        font-size: 1.3em;
        margin: 0;
        display: flex;
        align-items: center;
      }
      ul {
        list-style: none;
        padding-inline-start: 0;
        padding-left: 12px;
        width: 210px;
      }
      li {
        margin-bottom: 15px;
        font-weight: 400;
        cursor: pointer;
      }
    }
    .videoCount {
      position: absolute;
      right: 0;
      font-weight: 300;
    }
  }
  .selectedClass {
    font-size: 1.1em;
    font-weight: 600;
    background-color: $background-color_1;
    padding: 8px;
  }

  .videoPkg {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .videoDetails {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    padding-left: 40px;
    padding-top: 20px;
    h4 {
      margin-left: 15px;
      margin-top: 20px;
      margin-bottom: 2px;
    }
  }
  .details {
    p {
      margin: 0;
      width: max-content;
      display: inline;
    }
    div {
      margin-bottom: 5px;
      margin-left: 15px;
      font-size: 0.8em;
      font-weight: 300;
    }
    position: relative;
  }
  .description {
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;
    cursor: pointer;
    .tooltip {
      visibility: hidden;
      width: 400px;
      background-color: $background-color_2;
      color: $color_2;
      text-align: center;
      padding: 5px 0;
      border-radius: 6px;
      position: absolute;
      z-index: 1;
    }
    &:hover {
      .tooltip {
        visibility: visible;
      }
    }
  }
  .channel {
    position: absolute;
    bottom: 0;
  }
  img {
    width: 300px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  .play {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color_1;
    z-index: 100;
    &:hover {
      color: $color_2;
    }
    &:before {
      content: '';
      position: absolute;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: $background-color_3;
    }
  }
  .player {
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $background-color_4;
  }
</style>
