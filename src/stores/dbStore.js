import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  GroupBy,
  SortBy,
  filterObjectArray,
  ageCalculator,
  getRandomColor,
  sortObjByKeys
} from '@/utils/functions.js'
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYTM5ZmQxNzgyMTM2NzQwMjgxZThmOTg2MzliZjhjMyIsInN1YiI6IjY0MmRkMzBhYTZhNGMxMDBmNDJjNzkyNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pH71dmpF1xMXUASRPcJ_WUCcoTEK-4t9bloC61L07fo'
  }
}

function genderNumToStr(number) {
  switch (number) {
    case 0:
      return 'Not Set'
    case 1:
      return 'Female'
    case 2:
      return 'Male'
    case 3:
      return 'Non-binary'
  }
}

function CrewFilterByName(array) {
  let reduced = array.reduce((obj, item) => {
    item.job = Array(item.job)
    obj[item.name] ? obj[item.name].job.push(...item.job) : (obj[item.name] = item)
    return obj
  }, {})

  return reduced
}

function languageFormatter(lang) {
  let languageFormat = new Intl.DisplayNames(['en'], { type: 'language' })
  return languageFormat.of(lang)
}
function currencyFormatter(cur) {
  let currencyFormatter = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' })
  let returnval
  cur !== 0 ? (returnval = currencyFormatter.format(cur)) : (returnval = '-')
  return returnval
}

export const useDbStore = defineStore('dbstore', () => {
  const shared = ref(null)
  const person = ref(null)

  function resetStore() {
    shared.value = null
    person.value = null
  }
  const language = computed(() => {
    return localStorage.getItem('language')
  })
  /**
   *
   * @param {type} type all,movie,person,tv
   * @param {time} time day,week
   *  @param {language} language template en-US
   */
  async function getTrendingList(type, time, language) {
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/${type}/${time}?language=${language}`,
      options
    )
    const data = await response.json()

    return { currentPage: data.page, totalPage: data.total_pages, array: data.results }
  }
  /**
   *
   *  @param {mediaType} mediaType tv or movie
   * @param {type} type airing_today,on_the_air,popular,top_rated
   *  @param {language} language default en-US
   *   @param {page} page pageNumber

   */
  async function getList(mediaType, type, language, page, region) {
    const response = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${type}?language=${language}&page=${page}&region=${region}`,
      options
    )
    const data = await response.json()
    return { currentPage: data.page, totalPage: data.total_pages, array: data.results }
  }
  /**
   *
   * @param {mediaType} mediaType tv-movie
   * @param {query} query options https://developer.themoviedb.org/reference/discover-movie
   * @returns
   */
  async function Discover(mediaType, query) {
    const response = await fetch(
      `      https://api.themoviedb.org/3/discover/${mediaType}?${query}`,
      options
    )
    const data = await response.json()
    return { currentPage: data.page, totalPage: data.total_pages, array: data.results }
  }
  async function getLanguages() {
    const response = await fetch('https://api.themoviedb.org/3/configuration/languages', options)
    const data = await response.json()
    return data
  }
  async function searchMulti(query, language, page) {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=${language}&page=${page}`,
      options
    )
    const data = await response.json()
    return { currentPage: data.page, totalPage: data.total_pages, array: data.results }
  }
  async function searchMovie(query, language, page, primary_release_year, region, year) {
    let url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=${language}&page=${page}`
    if (primary_release_year) {
      url += '&primary_release_year=' + primary_release_year
    }
    if (year) {
      url += '&year=' + year
    }
    if (region) {
      url += '&region=' + region
    }
    const response = await fetch(url, options)
    const data = await response.json()
    return { currentPage: data.page, totalPage: data.total_pages, array: data.results }
  }
  async function getCountries(language) {
    const response = await fetch(
      `https://api.themoviedb.org/3/configuration/countries?language=${language}`,
      options
    )
    const data = await response.json()
    return data
  }
  async function getMediaDetails(type, id, detailType) {
    const response = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/${detailType}`,
      options
    )
    const data = await response.json()
    return data
  }
  async function getTVEpisodeGroupsDetails(episode_group_id) {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/episode_group/${episode_group_id}`,
      options
    )
    const data = await response.json()
    return data
  }
  async function getYoutubeDetails(text) {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails${text}key=AIzaSyBxAhdYttCBLgGAr-r_s-D535sC9hgoI7o`
    )
    const data = await response.json()
    return data
  }
  async function getEpisodes(id, seasonNumber, language) {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?language=${language}`,
      options
    )
    const data = await res.json()
    return data
  }
  async function getShared(type, id, language) {
    console.log('fetching')
    const response = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?language=${language}&append_to_response=credits,keywords,external_ids,videos,recommendations`,
      options
    )

    const data = await response.json()
    shared.value = data
    shared.value.backdrop_path =
      'url(' + `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${data.backdrop_path}` + ')'

    shared.value.color = getRandomColor()
    shared.value.reduced = CrewFilterByName(
      filterObjectArray(
        shared.value.credits.crew,
        ['Director', 'Screenplay', 'Story', 'Writer', 'Novel'],
        'job'
      )
    )

    shared.value.credits.crew = GroupBy(shared.value.credits.crew, 'department')
    let crewCount = 0
    for (const obj in shared.value.credits.crew) {
      crewCount = crewCount + shared.value.credits.crew[obj].length
      shared.value.credits.crew[obj] = CrewFilterByName(shared.value.credits.crew[obj])
    }
    shared.value.crewCount = crewCount
    shared.value.credits.crew = sortObjByKeys(shared.value.credits.crew)
    shared.value.original_language = languageFormatter(shared.value.original_language)
    if (type === 'movie') {
      shared.value.revenue = currencyFormatter(shared.value.revenue)
      shared.value.budget = currencyFormatter(shared.value.budget)
    }

    shared.value.videos = shared.value.videos.results
    let images = await getMediaDetails(type, id, 'images')
    images.posters = SortBy(images.posters, 'vote_average')
    images.backdrops = SortBy(images.backdrops, 'vote_average')
    shared.value.backdrops = images.backdrops
    shared.value.posters = images.posters
    shared.value.logos = images.logos
  }

  async function getPerson(id) {
    const response = await fetch(
      `https://api.themoviedb.org/3/person/${id}?append_to_response=images,external_ids,combined_credits,movie_credits,tv_credits&language=en-US`,
      options
    )
    const data = await response.json()
    person.value = data
    person.value.profiles = data.images.profiles
    person.value.movie_credits.crew = SortBy(person.value.movie_credits.crew, 'release_date')
    person.value.movie_credits.crew = SortBy(person.value.movie_credits.crew, 'release_date')
    person.value.movie_credits.cast = SortBy(person.value.movie_credits.cast, 'release_date')
    person.value.tv_credits.crew = SortBy(person.value.tv_credits.crew, 'release_date')
    person.value.tv_credits.cast = SortBy(person.value.tv_credits.cast)
    person.value.movie_credits.crew = GroupBy(person.value.movie_credits.crew, 'department')
    person.value.tv_credits.crew = GroupBy(person.value.tv_credits.crew, 'department')
    person.value.combined_credits.crew = GroupBy(person.value.combined_credits.crew, 'department')

    let departmentArr
    person.value.movie_credits.cast || person.value.tv_credits.cast
      ? (departmentArr = ['Acting'])
      : (departmentArr = [])

    Object.keys(person.value.combined_credits.crew).forEach((department) => {
      if (!departmentArr.includes(department)) {
        departmentArr.push(department)
      }
    })
    person.value.color = getRandomColor()
    person.value.departments = departmentArr
    person.value.gender = genderNumToStr(person.value.gender)
    person.value.age = ageCalculator(person.value.birthday)
  }

  function imageURL(size, path, type) {
    const baseURL = 'https://image.tmdb.org/t/p/'

    if (path !== '') {
      return baseURL + size + path
    } else {
      if (type === 'person') {
        return 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg'
      } else
        return 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'
    }
  }

  return {
    language,
    resetStore,
    getTrendingList,
    getList,
    getLanguages,
    getCountries,
    searchMulti,
    searchMovie,
    Discover,
    shared,
    getShared,
    person,
    getPerson,
    getMediaDetails,
    getTVEpisodeGroupsDetails,
    getYoutubeDetails,
    getEpisodes,
    imageURL
  }
})
