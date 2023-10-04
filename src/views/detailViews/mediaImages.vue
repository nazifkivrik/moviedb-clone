<script setup>
  import subNav from '@/components/subNavigationBar.vue'
  import backToMain from '@/components/backToMain.vue'
  import { onBeforeMount, ref, computed, inject } from 'vue'
  import { useDbStore } from '@/stores/dbStore'
  import { useRoute } from 'vue-router'
  import { storeToRefs } from 'pinia'
  const store = useDbStore()
  const options = inject('fetchOptions')
  const { shared, person } = storeToRefs(store)
  const languages = ref(null)
  const route = useRoute()
  const selectedOption = ref('en')
  const filteredImages = computed(() => {
    if (route.params.images === 'backdrops') {
      return filterByLanguage(shared.value.backdrops)
    } else if (route.params.images === 'logos') {
      return filterByLanguage(shared.value.logos)
    } else {
      return filterByLanguage(shared.value.posters)
    }
  })

  onBeforeMount(() => {
    iso_639_1_languages()
  })
  async function iso_639_1_languages() {
    const response = await fetch('https://api.themoviedb.org/3/configuration/languages', options)
    const data = await response.json()
    languages.value = data
  }
  function convertLanguage(key) {
    function checklanguage(obj) {
      return obj.iso_639_1 == key
    }

    let matched = languages.value.find(checklanguage)
    if (matched) {
      return matched.english_name
    } else return 'No Language'
  }

  function filterByLanguage(array) {
    let reduced = array.reduce((obj, item) => {
      if (obj[item.iso_639_1]) {
        obj[item.iso_639_1].push(item)
      } else {
        obj[item.iso_639_1] = [item]
      }
      return obj
    }, {})

    return reduced
  }
</script>

<template>
  <subNav />
  <backToMain />

  <template v-if="shared">
    <div class="backdrops" v-if="shared && languages">
      <div class="backdropSum">
        <h2 :style="{ 'background-color': shared.color }">
          {{ route.params.images.charAt(0).toUpperCase() + route.params.images.slice(1) }}
        </h2>
        <ul v-if="shared.backdrops">
          <li v-for="(language, key) in filteredImages" :key="key">
            <span
              :class="{ selectedClass: key === selectedOption }"
              @click="
                () => {
                  selectedOption = key
                }
              ">
              {{ convertLanguage(key) }}
            </span>
            <span class="translationCount">{{ Object.keys(language).length }}</span>
          </li>
        </ul>
      </div>
      <template v-if="shared.backdrops">
        <div class="imagesContainer" v-if="$route.params.images === 'backdrops'">
          <div v-for="(backdrops, key) in filteredImages" :key="key" class="imageDetails">
            <template v-if="key === selectedOption">
              <template v-for="backdrop in backdrops" :key="backdrop">
                <div class="card">
                  <app-link :to="store.imageURL('original', backdrop.file_path)">
                    <img :src="store.imageURL('w300', backdrop.file_path)" alt="" />
                  </app-link>
                  <div class="section">
                    <span style="font-weight: 300">Size</span>
                    {{ backdrop.width + 'x' + backdrop.height }}
                  </div>
                  <div class="section" v-if="shared.backdrops">
                    <span style="font-weight: 300">Language</span> {{ convertLanguage(key) }}
                  </div>
                </div>
              </template>
            </template>
          </div>
        </div>
      </template>
      <template v-if="shared.logos">
        <div class="imagesContainer" v-if="$route.params.images === 'logos'">
          <div v-for="(logos, key) in filteredImages" :key="key" class="imageDetails">
            <template v-if="key === selectedOption">
              <template v-for="logo in logos" :key="logo">
                <div class="card">
                  <app-link :to="store.imageURL('original', logo.file_path)"
                    ><img :src="store.imageURL('w154', logo.file_path)" alt=""
                  /></app-link>
                  <div class="section">
                    <span style="font-weight: 300">Size</span> {{ logo.width + 'x' + logo.height }}
                  </div>
                  <div class="section" v-if="shared.logos">
                    <span style="font-weight: 300">Language</span> {{ convertLanguage(key) }}
                  </div>
                </div>
              </template>
            </template>
          </div>
        </div>
      </template>
      <template v-if="shared.posters">
        <div class="imagesContainer" v-if="$route.params.images === 'posters'">
          <div v-for="(posters, key) in filteredImages" :key="key" class="imageDetails">
            <template v-if="key === selectedOption">
              <template v-for="poster in posters" :key="poster">
                <div class="card">
                  <app-link :to="store.imageURL('original', poster.file_path)"
                    ><img :src="store.imageURL('w300', poster.file_path)" alt=""
                  /></app-link>
                  <div class="section">
                    <span style="font-weight: 300">Size</span>
                    {{ poster.width + 'x' + poster.height }}
                  </div>
                  <div class="section" v-if="shared.posters">
                    <span style="font-weight: 300">Language</span> {{ convertLanguage(key) }}
                  </div>
                </div>
              </template>
            </template>
          </div>
        </div>
      </template>
    </div>
  </template>
  <template v-if="person">
    <template v-if="person.profiles">
      <div class="backdrops">
        <div class="backdropSum">
          <h2 :style="{ 'background-color': person.color }">
            {{ route.params.images.charAt(0).toUpperCase() + route.params.images.slice(1) }}
          </h2>
          <ul>
            <li>
              Profiles

              <span class="translationCount">{{ person.profiles.length }}</span>
            </li>
          </ul>
        </div>
        <div class="imagesContainer">
          <div class="imageDetails">
            <div v-for="profile in person.profiles" :key="profile">
              <div class="card">
                <app-link :to="store.imageURL('original', profile.file_path)"
                  ><img :src="store.imageURL('w154', profile.file_path)" alt=""
                /></app-link>
                <div class="section">
                  <span style="font-weight: 300">Size</span>
                  {{ profile.width + 'x' + profile.height }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </template>
</template>

<style scoped lang="scss">
  $color_1: white;
  @media all and (min-width: 750px) {
    .backdrops {
      display: flex;
      flex-direction: row;
    }
    .backdropSum {
      margin-left: 10vw;
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

    .translationCount {
      position: absolute;
      right: 0;
      font-weight: 300;
    }
    .imagesContainer {
      padding-left: 40px;
      padding-top: 40px;
    }
    .imagesContainer {
      .imageDetails {
        display: flex;
        flex-wrap: wrap;
        column-gap: 15px;
        row-gap: 15px;
      }
    }
  }
  @media all and (max-width: 750px) {
    .backdrops {
      display: flex;
      flex-direction: column;
      .backdropSum {
        h2 {
          color: white;
          position: relative;
          font-size: 1.7em;
          margin: 0;
          padding: 5px 20px;
          display: flex;
          align-items: center;
          .translationCount {
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
          .translationCount {
            position: absolute;
            font-weight: 300;
            right: 0;
          }

          li {
            position: relative;
            text-wrap: nowrap;
            padding: 0 15px;
            height: 1.3em;
          }
        }
      }
    }
    .imagesContainer {
      padding-top: 15px;
      .imageDetails {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 15px;
      }
    }
  }
  .selectedClass {
    font-weight: 600;
    font-size: 1.1em;
  }

  .section {
    display: flex;
    flex-direction: column;
    row-gap: 5px;
  }
  .card {
    padding: 5px;
    box-shadow:
      5px 5px 5px 2px #ededed,
      -5px -5px 5px 2px #ededed;
  }
</style>
