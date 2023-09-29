<script setup>
  const store = useDbStore()
  import { useDbStore } from '../stores/dbStore'
  import { ref, toRefs, onBeforeMount, computed } from 'vue'
  const { shared, person } = storeToRefs(store)
  const route = useRoute()
  import appLink from './appLink.vue'
  import { useRoute } from 'vue-router'
  import { storeToRefs } from 'pinia'
  const media = computed(() => {
    if (person.value) {
      return person.value
    } else if (shared.value) {
      return shared.value
    } else return null
  })
  const videoTypeItem = ref(null)
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

  let headers
  function menuItems(type) {
    switch (type) {
      case 'movie':
        return {
          overview: {
            titles: 'Alternative Titles',
            cast: 'Cast&Crew',
            release_dates: 'Release Dates',
            translations: 'Translations'
          },
          media: { backdrops: 'Backdrops', logos: 'Logos', posters: 'Posters' }
        }

      case 'tv':
        return {
          overview: {
            titles: 'Alternative Titles',
            cast: 'Cast&Crew',
            episode_groups: 'Episode Groups',
            seasons: 'Seasons',
            translations: 'Translations'
          },
          media: { backdrops: 'Backdrops', logos: 'Logos', posters: 'Posters' }
        }
      case 'person':
        return { overview: { translations: 'Translations' }, media: { profiles: 'Profiles' } }
    }
  }
  onBeforeMount(() => {
    headers = menuItems(route.params.type)
  })
</script>

<template>
  <template v-if="media">
    <div class="subNav">
      <ul class="Menus">
        <li class="header overview">
          <span>{{ $t('Overview') }} <icon-lib icon="fa-solid fa-caret-down" /></span>
          <div class="container">
            <ul>
              <li>
                <app-link :to="`/${$route.params.type}/${$route.params.id}`">{{
                  $t('Main')
                }}</app-link>
              </li>
              <li v-for="(obj, key) in headers.overview" :key="key">
                <app-link :to="`/${$route.params.type}/${$route.params.id}/${key}`">{{
                  $t(obj)
                }}</app-link>
              </li>

              <li></li>
              <li>{{ $t('Changes') }}</li>
              <li>{{ $t('Report') }}</li>
              <li>{{ $t('Edit') }}</li>
            </ul>
          </div>
        </li>

        <li class="header media">
          <span>{{ $t('Media') }} <icon-lib icon="fa-solid fa-caret-down" /></span>

          <div class="container">
            <ul>
              <li v-for="(imagetype, key) in headers.media" :key="key">
                <template v-if="media[key]">
                  <app-link :to="`/${$route.params.type}/${$route.params.id}/images/${key}`"
                    >{{ $t(imagetype) }}
                    <span class="count">{{ media[key].length }}</span>
                  </app-link>
                </template>
              </li>

              <template v-if="shared">
                <li class="videoWrapper">
                  {{ $t('Videos') }}
                  <span class="count"><icon-lib icon="fa-solid fa-caret-right" /></span>
                  <div>
                    <ul class="videoTypes container">
                      <template v-if="shared.videos">
                        <li
                          v-for="type in Object.keys(filterByVideoType(shared.videos))"
                          :key="type"
                          ref="videoTypeItem">
                          <appLink
                            :to="{
                              path:
                                '/' + $route.params.type + '/' + $route.params.id + '/' + 'videos',
                              query: { selectedType: type }
                            }">
                            {{ $t(type) }}</appLink
                          >
                        </li>
                      </template>
                    </ul>
                  </div>
                </li></template
              >
            </ul>
          </div>
        </li>

        <li class="header fandom">
          <span>{{ $t('Fandom') }} <icon-lib icon="fa-solid fa-caret-down" /></span>
          <div class="container">
            <ul>
              <li>{{ $t('Discussions') }}</li>
              <li>{{ $t('Reviews') }}</li>
            </ul>
          </div>
        </li>
        <li class="header share">
          <span>{{ $t('Share') }} <icon-lib icon="fa-solid fa-caret-down" /></span>
          <div class="container">
            <ul>
              <li>{{ $t('Share Link') }}</li>
              <li>Facebook</li>
              <li>Twitter</li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </template>
</template>

<style scoped>
  .subNav {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  ul {
    list-style: none;
    padding-inline-start: 0;
    cursor: pointer;
  }

  .header {
    overflow: hidden;
    height: 20px;
    width: 5.5em;
    display: flex;
    flex-direction: column;
  }

  .overview {
    position: relative;
    z-index: 70;
  }

  .media {
    position: relative;
    z-index: 80;
  }

  .fandom {
    position: relative;
    z-index: 90;
  }

  .share {
    position: relative;
    z-index: 95;
  }

  .header:hover {
    overflow: visible;
  }

  .Menus .container li:hover {
    text-decoration: underline;
  }

  .Menus .container li {
    padding-top: 5px;
  }

  .container {
    background-color: white;
    border-radius: 5px;
    padding: 15px;
    width: 10em;
    position: relative;
  }

  .container .count {
    position: absolute;
    right: 10px;
    font-size: 1em;
    font-weight: 300;
  }

  .container ul li {
    margin-left: 15px;
  }

  .videoWrapper {
    overflow: hidden;
    height: 20px;
    position: relative;
  }

  .videoWrapper:hover {
    overflow: visible;
  }

  .videoTypes {
    position: absolute;
    left: 10em;
    top: 20px;
  }

  .Menus {
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 20px;
    column-gap: 10px;
    width: max-content;
  }
</style>
