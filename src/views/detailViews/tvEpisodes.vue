<script setup>
  import backToMain from '@/components/backToMain.vue'
  import subNavigationBar from '@/components/subNavigationBar.vue'
  import { useDbStore } from '@/stores/dbStore'
  import { storeToRefs } from 'pinia'
  import { onBeforeMount, ref, watch, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { GroupBy } from '../../utils/functions'
  const store = useDbStore()
  const { shared } = storeToRefs(store)
  const route = useRoute()
  const router = useRouter()
  const episodes = ref()
  const episodeList = ref()
  const seasonNumber = computed(() => {
    return route.params.seasonNumber
  })
  watch(
    () => seasonNumber.value,
    () => router.go(0)
  )
  async function initialize() {
    if (!store.shared) {
      await store.getShared(route.params.type, route.params.id, localStorage.getItem('language'))
    }
    let res = await store.getEpisodes(
      route.params.id,
      route.params.seasonNumber,
      localStorage.getItem('language')
    )
    episodes.value = res.episodes
  }
  onBeforeMount(() => {
    initialize()
  })

  async function expand(index) {
    let res = await store.getEpisodeDetails(
      route.params.id,
      route.params.seasonNumber,
      index + 1,
      'images',
      localStorage.getItem('language')
    )
    episodes.value[index].crewGrouped = GroupBy(episodes.value[index].crew, 'department')
    for (const [key, value] of Object.entries(episodes.value[index].crewGrouped)) {
      episodes.value[index].crewGrouped[key] = GroupBy(value, 'name')
    }
    console.log(res)
    episodes.value[index].images = res.images
    episodeList.value[index].children[1].classList.toggle('hidden')
  }
</script>

<template>
  <template v-if="shared && episodes">
    <subNavigationBar />
    <backToMain />

    <div class="previousAndNext">
      <span class="previousSeason" v-if="route.params.seasonNumber > 0">
        <app-link :to="`/tv/${route.params.id}/season/${parseInt(route.params.seasonNumber) - 1}`">
          <icon-lib icon="fa-left-long" />
          {{ shared.seasons[route.params.seasonNumber - 1].name }}
        </app-link>
      </span>
      <span class="nextSeason" v-if="route.params.seasonNumber < shared.number_of_seasons">
        <app-link
          :to="{
            path: `/tv/${route.params.id}/season/${parseInt(route.params.seasonNumber) + 1} `
          }">
          {{ shared.seasons[parseInt(route.params.seasonNumber) + 1].name }}
          <icon-lib icon="fa-right-long" />
        </app-link>
      </span>
    </div>
    <div class="seasonContainer">
      <ul>
        <li v-for="(episode, index) in episodes" :key="episode" ref="episodeList">
          <span class="episode">
            <img
              :src="store.imageURL('w227_and_h127_bestv2', episode.still_path)"
              alt=""
              v-lazy-load
              @click="expand(index)" />

            <span class="info">
              <h2>{{ episode.episode_number }}&nbsp;{{ episode.name }}</h2>

              <span class="vote" v-if="episode.vote_average !== 0">
                <icon-lib icon="fa-solid fa-star" style="color: #ffffff" size="xs" />
                {{ Math.round(episode.vote_average * 10) / 10 }}
              </span>
              <span class="airDate"
                >{{ $d(episode.air_date, 'short') }} &#x2022; {{ episode.runtime }}m</span
              >

              <p class="lineClamp">{{ episode.overview }}</p>
            </span>
          </span>
          <span class="moreDetails hidden">
            <ul class="menus">
              <li>Videos</li>
              <li>Images</li>
              <li>Changes</li>
              <li>Report</li>
              <li>Edit</li>
            </ul>
            <span class="castCrew" v-if="episode.crewGrouped">
              <span class="crew" v-if="episode.crewGrouped['Directing']">
                <h3>
                  Crew <span class="count">{{ episode.crew.length }}</span>
                </h3>
                <span v-if="episode.crewGrouped['Directing']">
                  <strong>Directed by:</strong>
                  {{ Object.keys(episode.crewGrouped.Directing).toString() }}
                </span>
                <span v-else> <strong>Directed by:</strong> No director has been added.</span>
                <br />
                <span v-if="episode.crewGrouped['Writing']">
                  <strong>Written by:</strong>
                  {{ Object.keys(episode.crewGrouped.Writing).toString() }}
                </span>
                <span v-else> <strong>Written by:</strong> No writer has been added. </span>
              </span>

              <span class="cast" v-if="episode.guest_stars.length > 0">
                <h3>
                  Guest Stars <span class="count">{{ episode.guest_stars.length }}</span>
                </h3>
                <ul>
                  <li v-for="star in episode.guest_stars" :key="star">
                    <img
                      :src="store.imageURL('w66_and_h66_face', star.profile_path, 'person')"
                      alt=""
                      v-lazy-load />
                    <span class="starInfo">
                      <strong>{{ star.name }}</strong
                      ><br />
                      {{ star.character }}
                    </span>
                  </li>
                </ul>
              </span>
              <span class="cast" v-else>
                <h3>
                  Guest Stars <span class="count">{{ episode.guest_stars.length }}</span>
                </h3>
                No guest stars have been added.
              </span>
            </span>
            <span v-if="episode.images">
              <h3>Episode images</h3>

              <div class="imageContainer">
                <template v-for="image in episode.images.stills" :key="image">
                  <img
                    :src="store.imageURL('w160_and_h90_bestv2', image.file_path)"
                    alt=""
                    v-lazy-load />
                </template>
              </div>
            </span>
          </span>
          <span class="expand" @click="expand(index)"
            ><span><icon-lib icon="fa-caret-down" />Expand</span>
          </span>
        </li>
      </ul>
    </div>
  </template>
</template>

<style scoped lang="scss">
  .hidden {
    display: none;
  }
  .lineClamp {
    @include line-clamp(3);
  }
  ul {
    list-style: none;
    padding-inline-start: 0;
  }
  .previousAndNext {
    position: relative;
    padding: 1em 0;
    display: flex;
    align-items: center;
    border-bottom: solid 1px #e3e3e3ff;
    .previousSeason {
      position: absolute;
      left: 12%;
    }
    .nextSeason {
      position: absolute;
      right: 12%;
    }
  }

  .seasonContainer {
    padding-left: 50px;
    padding-top: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;

    > ul {
      display: flex;
      flex-direction: column;
      row-gap: 30px;
      width: max(75%, 1150px);

      > li {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        border-radius: 15px;
        box-shadow:
          5px 5px 10px 0 #e3e3e3ff,
          -5px -5px 10px 0 #e3e3e3ff;

        .episode {
          display: flex;
          flex-direction: row;
          position: relative;
          border-radius: 15px;

          img {
            height: 127px;
            border-top-left-radius: 15px;
            cursor: pointer;
          }

          .info {
            height: 127px;
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
              font-weight: 400;
              font-size: 0.9em;
            }

            p {
              font-size: 0.9em;
            }
          }
        }
        .moreDetails {
          margin-top: 35px;
          width: 100%;
          > ul {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
          }
          .castCrew {
            display: flex;
            flex-direction: row;
            .count {
              font-size: 0.9em;
              font-weight: 300;
            }
            .crew {
              width: 35%;
              padding: 15px 0 0 25px;
            }
            .cast {
              width: 60%;
              ul {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                row-gap: 15px;

                li {
                  display: flex;
                  width: 250px;
                  align-items: center;
                  img {
                    border-radius: 10px;
                    width: 66px;
                    height: 66px;
                  }
                  .starInfo {
                    padding-left: 13px;
                    font-size: 0.8;
                  }
                }
              }
            }
          }

          .imageContainer {
            overflow-x: scroll;
            display: flex;
            column-gap: 10px;
            padding: 10px 10px;
            @include custom-scrollbar;
          }
        }

        .expand {
          padding: 4px 0;
          cursor: pointer;
          width: 100%;
          display: flex;
          justify-content: center;
          border-top: solid 1px #e3e3e3ff;
        }
      }
    }
  }
</style>
