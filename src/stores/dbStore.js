import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getRandomColor, SortBy, GroupBy } from '@/utils/functions.js'
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_MOVIEDB_AUTHORIZATION}`
  }
}
const postOptions = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_MOVIEDB_AUTHORIZATION}`
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

// function CrewFilterByName(array) {
//   let reduced = array.reduce((obj, item) => {
//     item.job = Array(item.job)
//     obj[item.name] ? obj[item.name].job.push(...item.job) : (obj[item.name] = item)
//     return obj
//   }, {})

//   return reduced
// }

export const useDbStore = defineStore('useDbStore', () => {
  const shared = ref(null)
  const person = ref(null)

  function resetStore() {
    shared.value = null
    person.value = null
  }
  const language = computed(() => {
    return localStorage.getItem('language')
  })
  const region = computed(() => {
    return language.value.split('-')[1]
  })

  const mobile = computed(() => {
    if (window.innerWidth < 750) return true
    else return false
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
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails${text}key=${YOUTUBE_API_KEY}`
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
  async function getEpisodeDetails(id, seasonNumber, episodeNumber, append_to_response, language) {
    let fetchtext = `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?language=${language}`
    if (append_to_response) {
      fetchtext += `&append_to_response=${append_to_response}`
    }
    const res = await fetch(fetchtext, options)
    const data = await res.json()
    return data
  }
  async function getShared(type, id, language) {
    const response = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?language=${language}&append_to_response=credits,keywords,external_ids,videos,recommendations`,
      options
    )

    const data = await response.json()
    shared.value = data
    shared.value.backdrop_path =
      'url(' + `https://image.tmdb.org/t/p/w1920_and_h1080_multi_faces${data.backdrop_path}` + ')'

    shared.value.color = getRandomColor()
    let images = await getMediaDetails(type, id, 'images')
    shared.value.posters = SortBy(images.posters, 'vote_average')
    shared.value.backdrops = SortBy(images.backdrops, 'vote_average')
    shared.value.logos = SortBy(images.logos, 'vote_average')
    shared.value.videos = GroupBy(shared.value.videos.results, 'type')
  }

  async function getPerson(id, language) {
    console.log(language)
    const response = await fetch(
      `https://api.themoviedb.org/3/person/${id}?append_to_response=images,external_ids,combined_credits,movie_credits,tv_credits&language=${language}`,
      options
    )
    const data = await response.json()
    person.value = data

    person.value.color = getRandomColor()

    person.value.gender = genderNumToStr(person.value.gender)
  }
  async function getAvailableRegions(language) {
    const res = await fetch(
      `https://api.themoviedb.org/3/watch/providers/regions?language=${language}`,
      options
    )
    const data = await res.json()
    return data.results
  }
  async function getWatchProviders(type, language, region) {
    const res = await fetch(
      `https://api.themoviedb.org/3/watch/providers/${type}?language=${language}&watch_region=${region}`,
      options
    )
    const data = await res.json()
    return data.results
  }
  async function getGenres(language) {
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?language=${language}`,
      options
    )
    const data = await res.json()
    return data.genres
  }
  async function searchCompany(string, page) {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/company?query=${string}&page=${page}`,
      options
    )
    const data = await res.json()
    return { currentPage: data.page, totalPage: data.total_pages, array: data.results }
  }
  async function searchKeyword(string, page) {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/keyword?query=${string}&page=${page}`,
      options
    )
    const data = await res.json()
    return { currentPage: data.page, totalPage: data.total_pages, array: data.results }
  }
  function imageURL(size, path, type) {
    const baseURL = 'https://image.tmdb.org/t/p/'
    if (!path) {
      if (type === 'person')
        return 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg'
      else
        return 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'
    } else {
      return baseURL + size + path
    }
  }
  const createRequestToken = async () => {
    const res = await fetch('https://api.themoviedb.org/3/authentication/token/new', options)
    const data = await res.json()
    return data
  }
  const createSession = async (token) => {
    postOptions.body = JSON.stringify({ request_token: token })
    const res = await fetch('https://api.themoviedb.org/3/authentication/session/new', postOptions)
    const data = await res.json()
    return data
  }
  const getAccountLists = async (page, sessionId) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/account/account_id/lists?page=${page}&session_id=${sessionId}`,
      options
    )
    const data = res.json()
    return data
  }

  return {
    language,
    mobile,
    region,
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
    getEpisodeDetails,
    getAvailableRegions,
    getWatchProviders,
    getGenres,
    searchCompany,
    searchKeyword,
    imageURL,
    createRequestToken,
    createSession,
    getAccountLists
  }
})
