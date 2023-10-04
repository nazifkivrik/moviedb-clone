import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYTM5ZmQxNzgyMTM2NzQwMjgxZThmOTg2MzliZjhjMyIsInN1YiI6IjY0MmRkMzBhYTZhNGMxMDBmNDJjNzkyNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pH71dmpF1xMXUASRPcJ_WUCcoTEK-4t9bloC61L07fo'
  }
}
function sortByReleaseDates(a, b) {
  if (a.release_date < b.release_date) {
    return 1
  }
  if (a.release_date > b.release_date) {
    return -1
  }
  return 0
}
function CrewFilterByDepartment(array) {
  let reduced = array.reduce((obj, item) => {
    if (obj[item.department]) {
      obj[item.department].push(item)
    } else {
      obj[item.department] = [item]
    }
    return obj
  }, {})
  return reduced
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

function ageCalculator(birthdate) {
  const today = new Date()
  const birthday = new Date(birthdate)
  const age =
    today.getFullYear() -
    birthday.getFullYear() -
    (today.getMonth() < birthday.getMonth() ||
      (today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate()))
  return age
}
function compareByVote(a, b) {
  if (a.vote_average < b.vote_average) {
    return 1
  }
  if (a.vote_average > b.vote_average) {
    return -1
  }
  return 0
}

function CrewFilterByName(array) {
  let reduced = array.reduce((obj, item) => {
    item.job = Array(item.job)
    obj[item.name] ? obj[item.name].job.push(...item.job) : (obj[item.name] = item)
    return obj
  }, {})

  return reduced
}

function sortObjByKeys(unorderedObj) {
  const ordered = Object.keys(unorderedObj)
    .sort()
    .reduce((obj, key) => {
      obj[key] = unorderedObj[key]
      return obj
    }, {})
  return ordered
}
function getRandomColor() {
  var letters = '01234567'.split('')
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)]
  }
  return color
}
function crewFilterByArray(crew) {
  let arr = new Array()
  let movieFilterArr = ['Director', 'Screenplay', 'Story', 'Writer', 'Novel']
  crew.map((item) =>
    movieFilterArr.forEach((filter) =>
      item.job === filter ? arr.push({ name: item.name, job: item.job }) : ''
    )
  )
  return arr
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
  const language = ref(null)
  function resetStore() {
    shared.value = null
    person.value = null
  }

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
  async function getCountries(language) {
    const response = await fetch(
      `https://api.themoviedb.org/3/configuration/countries?language=${language}`,
      options
    )
    const data = await response.json()
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
    shared.value.reduced = CrewFilterByName(crewFilterByArray(shared.value.credits.crew))
    shared.value.credits.crew = CrewFilterByDepartment(shared.value.credits.crew)
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
    getMedia(type, id)
  }

  async function getMedia(type, id) {
    const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/images`, options)
    const data = await response.json()
    data.backdrops = data.backdrops.sort(compareByVote)
    data.posters = data.posters.sort(compareByVote)

    shared.value.backdrops = data.backdrops
    shared.value.posters = data.posters
    shared.value.logos = data.logos
  }
  async function getPerson(id) {
    const response = await fetch(
      `https://api.themoviedb.org/3/person/${id}?append_to_response=images,external_ids,combined_credits,movie_credits,tv_credits&language=en-US`,
      options
    )
    const data = await response.json()
    person.value = data
    person.value.profiles = data.images.profiles
    person.value.movie_credits.crew.sort(sortByReleaseDates)
    person.value.movie_credits.cast.sort(sortByReleaseDates)
    person.value.tv_credits.crew.sort(sortByReleaseDates)
    person.value.tv_credits.cast.sort(sortByReleaseDates)
    person.value.movie_credits.crew = CrewFilterByDepartment(person.value.movie_credits.crew)
    person.value.tv_credits.crew = CrewFilterByDepartment(person.value.tv_credits.crew)
    person.value.combined_credits.crew = CrewFilterByDepartment(person.value.combined_credits.crew)

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
    console.log(person.value)
  }

  function imageURL(size, path) {
    const baseURL = 'https://image.tmdb.org/t/p/'
    return baseURL + size + path
  }

  return {
    language,
    resetStore,
    getTrendingList,
    getList,
    getLanguages,
    getCountries,
    Discover,
    shared,
    getShared,
    person,
    getPerson,
    getMedia,
    imageURL
  }
})
