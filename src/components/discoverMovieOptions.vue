<script setup>
  import { ref, inject, onBeforeMount, reactive, watch, onMounted, computed } from 'vue'
  import dualSlider from '@/components/dualRangeSlider.vue'
  import { useRoute } from 'vue-router'
  import { useDbStore } from '@/stores/dbStore.js'
  import { debounce } from 'lodash'
  const options = inject('fetchOptions')
  const store = useDbStore()
  const route = useRoute()
  const emits = defineEmits(['discover'])

  const sortOptions = [
    { en: 'Popularity Descending', text: 'popularity.desc' },
    { en: 'Popularity Ascending', text: 'popularity.asc' },
    { en: 'Rating Descending', text: 'vote_average.desc' },
    { en: 'Rating Ascending', text: 'vote_average.asc' },
    { en: 'Release Date Descending', text: 'primary_release_date.desc' },
    { en: 'Release Date Ascending', text: 'primary_release_date.asc' },
    { en: 'Revenue Ascending', text: 'revenue.asc' },
    { en: 'Revenue Descending', text: 'revenue.desc' }
  ]
  const releaseTypes = {
    Premiere: 1,
    'Theatrical(limited)': 2,
    Theatrical: 3,
    Digital: 4,
    Physical: 5,
    TV: 6
  }
  const availabilities = ['Stream', 'Free', 'Ads', 'Rent', 'Buy']

  const collapseSort = ref(true)
  const collapseWatch = ref(true)
  const collapseFilters = ref(false)

  const searchAllCountries = ref(true)
  const searchAllReleases = ref(true)

  const discoverOptions = reactive({
    Keywords: [],
    SortOpt: { en: 'Popularity Descending', text: 'popularity.desc' },
    Region: { english_name: 'Turkey', iso_3166_1: 'TR' },
    SearchAllCountries: searchAllCountries,
    Country: { english_name: 'Turkey', iso_3166_1: 'TR' },
    searchAllAvailabilities: true,
    Availabilities: [],
    MinimumUserVotes: 0,
    UserScore: { min: 0, max: 10 },
    Runtime: { min: 0, max: 400 },
    DateFrom: '',
    DateTo: '',
    Genres: [],
    Language: { english_name: 'None Selected', iso_3166_1: '' },
    WatchProviders: [],
    Releases: [1, 2, 3, 4, 5, 6]
  })
  const optionsChanged = ref(false)
  watch(
    () => [{ ...discoverOptions }],
    () => (optionsChanged.value = true),
    { deep: true }
  )
  function closeList(e, array) {
    e.className = 'passive'
    array.length = 0
  }
  async function initialOptions(obj) {
    let lang = navigator.language
    getAvailableRegions(lang)
    getGenres(lang)
    await getCountries(lang)
    await getWatchProviders(lang, lang.split('-')[1])
    countries.value.forEach((item) => {
      if (item.iso_3166_1 === lang.split('-')[1]) {
        discoverOptions.Region = item
      }
    })
    switch (route.query.query) {
      case 'popular': {
        let dateTo = new Date()
        dateTo.setHours(0, 0, 0, 0)
        dateTo.setMonth(dateTo.getMonth() + 5)

        obj.DateTo = dateTo.toISOString().split('T')[0]
        break
      }
      case 'top-rated': {
        obj.MinimumUserVotes = 300
        let dateTo = new Date()
        dateTo.setMonth(dateTo.getMonth() + 5)
        obj.DateTo = dateTo.toISOString().split('T')[0]
        break
      }
      case 'now-playing': {
        let dateFrom = new Date()
        dateFrom.setDate(dateFrom.getDate() - 37)
        obj.DateFrom = dateFrom.toISOString().split('T')[0]
        let dateTo = new Date()
        dateTo.setDate(dateTo.getDate() + 5)
        obj.DateTo = dateTo.toISOString().split('T')[0]
        searchAllReleases.value = false
        obj.Releases = [3]
        break
      }
      case 'upcoming': {
        let dateFrom = new Date()
        obj.DateFrom = dateFrom.toISOString().split('T')[0]
        dateFrom.setDate(dateFrom.getDate() + 5)

        let dateTo = new Date()

        dateTo.setDate(dateTo.getDate() + 25)
        obj.DateTo = dateTo.toISOString().split('T')[0]
        searchAllReleases.value = false
        obj.Releases = [3]
        break
      }
    }
    emits('discover', discoverOptions)
  }
  //#region setSelected
  function setSelectedKeywords(name) {
    if (!discoverOptions.Keywords.includes(name)) {
      discoverOptions.Keywords.push(name)
    }
  }
  function setSelectedSortOpt(set, event) {
    discoverOptions.SortOpt = set
    event.target.parentElement.classList.toggle('collapse')
  }
  function setSelectedWatchProviders(providerName) {
    if (!discoverOptions.WatchProviders.includes(providerName)) {
      discoverOptions.WatchProviders.push(providerName)
    } else {
      discoverOptions.WatchProviders.splice(discoverOptions.WatchProviders.indexOf(providerName), 1)
    }
  }
  function setSelectedGenres(genre) {
    if (!discoverOptions.Genres.includes(genre)) {
      discoverOptions.Genres.push(genre)
    } else {
      discoverOptions.Genres.splice(discoverOptions.Genres.indexOf(genre), 1)
    }
  }
  function setSelectedCountry(set, event) {
    discoverOptions.Country.english_name = set.english_name
    discoverOptions.Country.iso_3166_1 = set.iso_3166_1
    event.target.parentElement.parentElement.classList.toggle('collapse')
  }
  function setSelectedRegion(set, event) {
    discoverOptions.Region.english_name = set.english_name
    discoverOptions.Region.iso_3166_1 = set.iso_3166_1
    getWatchProviders('en-US', set.iso_3166_1)
    event.target.parentElement.parentElement.classList.toggle('collapse')
  }
  function setSelectedReleaseTypes(release) {
    if (!discoverOptions.Releases.includes(release)) {
      discoverOptions.Releases.push(release)
    } else {
      discoverOptions.Releases.splice(discoverOptions.Releases.indexOf(release), 1)
    }
  }
  function setSelectedLanguage(set, event) {
    discoverOptions.Language.english_name = set.english_name
    discoverOptions.Language.iso_3166_1 = set.iso_639_1
    event.target.parentElement.classList.toggle('collapse')
  }
  function setSelectedAvailabilities(release) {
    if (!discoverOptions.Availabilities.includes(release)) {
      discoverOptions.Availabilities.push(release)
    } else {
      discoverOptions.Availabilities.splice(discoverOptions.Availabilities.indexOf(release), 1)
    }
  }
  //#endregion
  //#region Regions
  const filterRegionsString = ref('')
  const filteredRegions = ref()
  const availableRegions = ref()
  const watchProviders = ref()
  async function getAvailableRegions(language) {
    const res = await fetch(
      `https://api.themoviedb.org/3/watch/providers/regions?language=${language}`,
      options
    )
    const data = await res.json()
    availableRegions.value = data.results
    filteredRegions.value = data.results
  }
  async function getWatchProviders(language, region) {
    const res = await fetch(
      `https://api.themoviedb.org/3/watch/providers/movie?language=${language}&watch_region=${region}`,
      options
    )
    const data = await res.json()
    watchProviders.value = data.results
  }
  watch(
    () => filterRegionsString.value,
    () => filterRegions()
  )

  function filterRegions() {
    let arr = []
    availableRegions.value.forEach((item) => {
      if (item.english_name.toLowerCase().search(filterRegionsString.value.toLowerCase()) != -1) {
        arr.push(item)
      }
    })
    filteredRegions.value = arr
  }

  //#endregion
  //#region Countries
  const countries = ref()
  const filterCountryString = ref('')
  const filteredCountries = ref()
  async function getCountries(language) {
    const res = await fetch(
      `https://api.themoviedb.org/3/configuration/countries?language=${language}`,
      options
    )
    const data = await res.json()
    countries.value = data
    filteredCountries.value = data
  }
  watch(
    () => filterCountryString.value,
    () => filterCountry()
  )
  function filterCountry() {
    let arr = []
    countries.value.forEach((item) => {
      if (item.english_name.toLowerCase().search(filterCountryString.value.toLowerCase()) != -1) {
        arr.push(item)
      }
    })
    filteredCountries.value = arr
  }

  //#endregion
  //#region Genres
  const genres = ref()

  async function getGenres(language) {
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?language=${language}`,
      options
    )
    const data = await res.json()
    genres.value = data.genres
  }
  //#endregion
  //#region Languages
  const filterLanguageString = ref('')
  const languages = ref()
  const filteredLanguages = ref()

  async function getLanguages() {
    const res = await fetch('https://api.themoviedb.org/3/configuration/languages', options)
    const data = await res.json()
    languages.value = data
    filteredLanguages.value = data
  }
  watch(
    () => filterLanguageString.value,
    () => filterLanguages()
  )
  function filterLanguages() {
    let arr = []
    languages.value.forEach((item) => {
      if (item.english_name.toLowerCase().search(filterLanguageString.value.toLowerCase()) != -1) {
        arr.push(item)
      }
    })
    filteredLanguages.value = arr
  }
  //#endregion
  //#region Keywords
  const searchedKeywords = ref([])
  const keywordsContainer = ref()
  const keywordSearchString = ref('')
  async function getKeywords(string, page) {
    let obj
    const res = await fetch(
      `https://api.themoviedb.org/3/search/keyword?query=${string}&page=${page}`,
      options
    )
    const data = await res.json()
    obj = data
    return obj
  }
  watch(
    () => keywordSearchString.value,
    () => getNewKeywordPage()
  )
  async function getNewKeywordPage() {
    let keywords = await getKeywords(keywordSearchString.value, '1')
    searchedKeywords.value = keywords.results
    currentKeywordPage = keywords.page
    totalKeywordPage = keywords.total_pages
  }
  let currentKeywordPage
  let totalKeywordPage
  const getKeywordPagesLazyDebounced = debounce(async function getKeywordPagesLazy(event) {
    if (event.target.scrollHeight - event.target.scrollTop < 500) {
      if (currentKeywordPage < totalKeywordPage) {
        let keywords = await getKeywords(keywordSearchString.value, currentKeywordPage + 1)

        keywords.results.forEach((item) => searchedKeywords.value.push(item))
        currentKeywordPage = keywords.page
        totalKeywordPage = keywords.total_pages
      }
    }
  }, 150)
  //#endregion
  onBeforeMount(() => {
    getLanguages()

    filteredRegions.value = availableRegions.value
    initialOptions(discoverOptions)
  })
</script>

<template>
  <div class="optionsContainer">
    <ul>
      <li :class="[collapseSort ? 'collapse' : 'grow', 'sort']">
        <h2 @click="() => (collapseSort = !collapseSort)">
          Sort <icon-lib :icon="['fas', collapseSort ? 'angle-right' : 'angle-down']"></icon-lib>
        </h2>
        <h4>Sort Results By</h4>

        <ul class="collapse" v-click-outside="(e) => (e.className = 'collapse')">
          <h3 @click="(e) => e.target.parentElement.classList.toggle('collapse')">
            {{ discoverOptions.SortOpt.en }}
            <icon-lib icon="fa-caret-down"></icon-lib>
          </h3>
          <li
            v-for="(sortOpt, index) in sortOptions"
            :key="index"
            @click="setSelectedSortOpt(sortOpt, $event)">
            {{ sortOpt.en }}
          </li>
        </ul>
      </li>

      <li>
        <div :class="[collapseWatch ? 'collapse' : '', 'whereToWatch']">
          <h2 @click="collapseWatch = !collapseWatch">
            Where To Watch
            <icon-lib :icon="['fas', collapseWatch ? 'angle-right' : 'angle-down']"></icon-lib>
          </h2>
          <h4>Country</h4>
          <div class="collapse" v-click-outside="(e) => (e.className = 'collapse')">
            <h3 @click="(e) => e.target.parentElement.classList.toggle('collapse')">
              <span :class="'fi fi-' + discoverOptions.Region.iso_3166_1.toLowerCase()"></span>
              {{ discoverOptions.Region.english_name }}
              <icon-lib icon="fa-solid fa-caret-down"></icon-lib>
            </h3>
            <ul class="regions">
              <li class="search">
                <input type="text" v-model="filterRegionsString" />
                <icon-lib icon="fa-solid fa-magnifying-glass" size="lg"></icon-lib>
              </li>
              <li
                v-for="region in filteredRegions"
                :key="region"
                @click="setSelectedRegion(region, $event)">
                <span :class="'fi fi-' + region.iso_3166_1.toLowerCase()"></span>

                {{ region.english_name }}
              </li>
            </ul>
          </div>
          <div class="watchProviders">
            <ul>
              <li
                v-for="provider in watchProviders"
                :key="provider"
                @click="setSelectedWatchProviders(provider.provider_name)">
                <div class="providerImage">
                  <img :src="store.imageURL('w45', provider.logo_path)" alt="" />
                  <span v-if="discoverOptions.WatchProviders.includes(provider.provider_name)">
                    <icon-lib icon="fa-solid fa-check" size="xl"></icon-lib>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </li>

      <li class="filters">
        <h2 @click="collapseFilters = !collapseFilters">
          Filters
          <icon-lib :icon="['fas', !collapseFilters ? 'angle-right' : 'angle-down']"></icon-lib>
        </h2>

        <ul v-if="collapseFilters">
          <li>
            <h4>Availabilities</h4>
            <input
              type="checkbox"
              id="searchAllAvailabilities"
              v-model="discoverOptions.searchAllAvailabilities"
              @change="(e) => (e.target.checked ? (discoverOptions.Availabilities = []) : '')" />
            <label for="searchAllAvailabilities">Search all availabilities?</label>
            <template v-if="!discoverOptions.searchAllAvailabilities">
              <div v-for="item in availabilities" :key="item">
                <input
                  type="checkbox"
                  :id="item"
                  @change="setSelectedAvailabilities(item)"
                  :checked="discoverOptions.Availabilities.includes(item)" />
                <label :for="item">{{ item }}</label>
              </div>
            </template>
          </li>
          <li class="releaseDates">
            <h4>Release Dates</h4>
            <div>
              <input
                type="checkbox"
                id="searchAllDates"
                v-model="searchAllReleases"
                @change="(e) => (e.target.checked ? (discoverOptions.Releases = []) : '')" />
              <label for="searchAllDates">Search all releases</label>
            </div>
            <div v-if="!searchAllReleases">
              <input type="checkbox" id="searchAllCountries" v-model="searchAllCountries" />
              <label for="searchAllCountries">Search all countries</label>
            </div>
            <div class="collapse" v-if="!searchAllCountries && !searchAllReleases">
              <h3 @click="(e) => e.target.parentElement.classList.toggle('collapse')">
                <span :class="'fi fi-' + discoverOptions.Country.iso_3166_1.toLowerCase()"></span>

                {{ discoverOptions.Country.english_name }}
                <icon-lib icon="fa-caret-down"></icon-lib>
              </h3>
              <ul class="countries">
                <li class="search">
                  <input type="text" v-model="filterCountryString" />
                  <icon-lib icon="fa-solid fa-magnifying-glass" size="lg"></icon-lib>
                </li>
                <li
                  v-for="country in filteredCountries"
                  :key="country"
                  @click="setSelectedCountry(country, $event)">
                  <span :class="'fi fi-' + country.iso_3166_1.toLowerCase()"></span>

                  {{ country.english_name }}
                </li>
              </ul>
            </div>

            <ul class="releaseTypes" v-if="!searchAllReleases">
              <li v-for="(release, key) in releaseTypes" :key="release">
                <input
                  type="checkbox"
                  :id="key"
                  :checked="discoverOptions.Releases.includes(release)"
                  @change="setSelectedReleaseTypes(release)" />
                <label :for="key">{{ key }}</label>
              </li>
            </ul>
            <div class="date">
              <label for="dateFrom">From</label>
              <input
                type="date"
                id="dateFrom"
                placeholder="''"
                v-model="discoverOptions.DateFrom" />
            </div>
            <div class="date">
              <label for="dateTo">To</label>
              <input type="date" id="dateTo" placeholder="''" v-model="discoverOptions.DateTo" />
            </div>
          </li>
          <li class="genres">
            <h4>Genres</h4>
            <ul>
              <li
                v-for="genre in genres"
                :key="genre"
                @click="setSelectedGenres(genre.id)"
                :class="discoverOptions.Genres.includes(genre.id) ? 'selected' : ''">
                {{ genre.name }}
              </li>
            </ul>
          </li>
          <li class="language">
            <h4>Language</h4>
            <div class="collapse" v-click-outside="(e) => (e.className = 'collapse')">
              <h3 @click="(e) => e.target.parentElement.classList.toggle('collapse')">
                {{ discoverOptions.Language.english_name }}
              </h3>
              <ul>
                <li class="search">
                  <input type="text" v-model="filterLanguageString" />
                  <icon-lib icon="fa-solid fa-magnifying-glass" size="sm"></icon-lib>
                </li>
                <li
                  @click="
                    setSelectedLanguage({ english_name: 'None Selected', iso_3166_1: null }, $event)
                  ">
                  None Selected
                </li>
                <li
                  v-for="language in filteredLanguages"
                  :key="language"
                  @click="setSelectedLanguage(language, $event)">
                  {{ language.english_name }}
                </li>
              </ul>
            </div>
          </li>
          <li class="userScore">
            <h4>User Score</h4>
            <dualSlider
              :min="0"
              :max="10"
              :step="1"
              @valArray="(obj) => (discoverOptions.UserScore = obj)" />
          </li>
          <li class="minimumUserVotes">
            <h4>Minimum User Votes</h4>
            <input
              type="range"
              min="0"
              max="500"
              step="50"
              v-model="discoverOptions.MinimumUserVotes" />
            <div class="values">
              <span></span><span>100</span><span>200</span><span>300</span><span>400</span
              ><span>500</span>
            </div>
          </li>
          <li class="runtime">
            <h4>Runtime</h4>
            <dualSlider
              :min="0"
              :max="400"
              :step="15"
              @valArray="(obj) => (discoverOptions.Runtime = obj)" />
          </li>
          <li class="keywords">
            <h4>Keywords</h4>
            <ul class="selectedKeywords">
              <li v-for="keyword in discoverOptions.Keywords" :key="keyword">
                {{ keyword }}
                <span
                  @click="
                    discoverOptions.Keywords.splice(
                      discoverOptions.Keywords.indexOf(keyword.name),
                      1
                    )
                  "
                  ><icon-lib icon="fa-solid fa-xmark"></icon-lib
                ></span>
              </li>
            </ul>
            <input type="text" placeholder="Filter by keywords..." v-model="keywordSearchString" />
            <ul
              ref="keywordsContainer"
              @scroll="getKeywordPagesLazyDebounced($event)"
              :class="[searchedKeywords.length !== 0 ? 'keywordSearch' : 'passive']"
              v-click-outside="(e) => closeList(e, searchedKeywords)"
              id="keywordsCont"
              v-if="keywordSearchString">
              <li
                v-for="keyword in searchedKeywords"
                :key="keyword.id"
                @click="setSelectedKeywords(keyword.name)">
                {{ keyword.name }}
              </li>
            </ul>
          </li>
        </ul>
      </li>

      <button
        :class="[optionsChanged ? 'buttonActive' : 'buttonPassive', 'done']"
        @click="() => emits('discover', discoverOptions)">
        Done
      </button>
    </ul>
  </div>
</template>

<style scoped lang="scss">
  .selected {
    background-color: aqua;
    color: white;
  }
  .buttonActive {
    pointer-events: all;
    background-color: #01b4e4ff;
    color: black;
    cursor: pointer;
  }
  .buttonPassive {
    pointer-events: none;
    color: rgba(0, 0, 0, 0.5);
    background-color: white;
    cursor: not-allowed;
  }
  .passive {
    display: none;
  }
  .collapse {
    overflow: hidden;
    height: 1.5em;
  }

  input[type='date'] {
    outline: none;
    border-radius: 5px;
    padding: 5px;
  }
  input[type='range'] {
    width: 100%;
  }
  input[type='range']::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    height: 10px;
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;

    background-color: #3264fe;
    cursor: pointer;
    margin-top: -4px;
    pointer-events: auto;
  }

  .search {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 258px;
    input {
      position: relative;
      width: 258px;
      height: 1.5em;
      border-radius: 8px;
      outline: none;
    }
    svg {
      position: absolute;
      right: 5px;
      color: black;
    }
  }
  ul {
    list-style: none;
    padding-inline-start: 0;
  }
  li {
    cursor: pointer;
  }
  .optionsContainer {
    width: 100%;
    > ul {
      user-select: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      row-gap: 20px;
      border-radius: 15px;
      width: 100%;
      > li {
        position: relative;
        width: 80%;
        border-radius: 15px;
        padding: 15px;
        box-shadow:
          5px 5px 10px 0 #e3e3e3ff,
          -5px -5px 10px 0 #e3e3e3ff;
      }
      h4 {
        margin: 15px 5px 13px 5px;
        font-weight: 300;
      }
      h2 {
        margin: 0;
        font-size: 1.5em;
        font-weight: 500;
        display: flex;
        align-items: center;
        svg {
          position: absolute;
          right: 0;
          pointer-events: none;
        }
      }
      h3 {
        margin: 0 5px 13px 5px;
        font-size: 1.2em;
        font-weight: 400;
        svg {
          pointer-events: none;
        }
      }
      .sort {
        ul {
          display: flex;
          flex-direction: column;
          row-gap: 5px;
          li {
            font-size: 1.1em;
          }
        }
      }
      .whereToWatch {
        .regions {
          overflow-y: scroll;
          height: 300px;
          display: flex;
          flex-direction: column;
          row-gap: 10px;
          padding-left: 10px;
          li {
            font-size: 1.1em;
          }
        }
        .watchProviders {
          .providerImage {
            display: flex;
            position: relative;
            span {
              display: flex;
              align-items: center;
              justify-content: center;
              position: absolute;
              width: 100%;
              height: 100%;
              color: white;
              font-weight: 500;
              background-color: aqua;
            }
          }
          ul {
            margin-top: 25px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            row-gap: 10px;
            column-gap: 10px;
          }
        }
      }
      .filters {
        > ul {
          display: flex;
          flex-direction: column;
          row-gap: 30px;
          > li {
            border-top: 1px solid #e3e3e3ff;
          }
          > li:last-child {
            border-bottom: 1px solid #e3e3e3ff;
          }
        }
        .releaseDates {
          .countries {
            overflow-y: scroll;
            height: 300px;
            display: flex;
            flex-direction: column;
            row-gap: 10px;
            padding-left: 10px;
            li {
              font-size: 1.1em;
            }
          }
        }
        .date {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0;
          width: 60%;
          label {
            font-weight: 300;
          }
        }
        .genres {
          ul {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            row-gap: 7px;
            column-gap: 7px;
            li {
              font-size: 0.85em;
              padding: 10px;
              border: 1px solid;
              border-radius: 20px;
              &:hover {
                background-color: aqua;
                color: white;
              }
            }
          }
        }
        .language {
          ul {
            overflow-y: scroll;
            height: 300px;
            display: flex;
            flex-direction: column;
            row-gap: 10px;
            padding-left: 10px;
            li {
              font-size: 1.1em;
            }
          }
        }
        .userScore {
          h4 {
            margin-bottom: 20px;
          }
        }
        .minimumUserVotes {
          position: relative;
          .values {
            display: flex;
            justify-content: space-between;
          }
        }
        .keywords {
          display: flex;
          flex-direction: column;
          height: max-content;
          input {
            margin: 15px 0;
            align-self: center;
            height: 30px;
            padding-left: 10px;
          }
          .selectedKeywords {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            row-gap: 10px;
            column-gap: 5px;
            li {
              background-color: #e4e7ebff;
              padding: 8px;
              border-radius: 15px;
              cursor: default;
              svg {
                cursor: pointer;
              }
            }
          }
          .keywordSearch {
            align-self: center;
            display: flex;
            flex-direction: column;
            height: 200px;
            overflow-y: scroll;
            margin-top: 10px;
            box-shadow:
              5px 5px 10px 0 #e3e3e3ff,
              -5px -5px 10px 0 #e3e3e3ff;
            padding: 7px;
            row-gap: 8px;
            width: 250px;
            li {
              font-size: 1.2em;
            }
          }
        }
      }
    }
    .done {
      box-sizing: border-box;
      width: 260px;
      height: 44px;

      border-radius: 22px;
      font-size: 1.5em;
      align-self: center;
      display: inline;
    }
  }
</style>
