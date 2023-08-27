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

export const useDbStore = defineStore('dbstore', () => {
  const movieLists = reactive({ Streaming: null, Popular: null, TopRated: null, Upcoming: null })
  const trendingLists = reactive({
    All: { Today: null, 'This Week': null },
    Movies: { Today: null, 'This Week': null },
    People: { Today: null, 'This Week': null },
    TV: { Today: null, 'This Week': null }
  })
  const TVSeriesLists = reactive({
    'Airing Today': null,
    'On TV': null,
    Popular: null,
    'Top Rated': null
  })
  const movie = ref(null)
  function resetStore() {
    movie.value = null
  }
  /**
   *Documentation
   * @param {now_playing} now_playing NowPlayingMovies
   * @param {popular} popular popularMovies
   * @param {top_rated} top_rated topRatedMovies
   * @param {upcoming} upcoming upcomingMovies
   */
  async function getMovieList(type) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${type}?language=en-US&page=1`,
      options
    )
    const data = await response.json()
    switch (type) {
      case 'now_playing':
        movieLists.Streaming = data.results
        break
      case 'popular':
        movieLists.Popular = data.results
        break
      case 'top_rated':
        movieLists.TopRated = data.results
        break
      case 'upcoming':
        movieLists.Upcoming = data.results
        break
    }
  }
  /**
   *
   * @param {type} type all,movie,person,tv
   * @param {time} time day,week
   */
  async function getTrendingList(type, time) {
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/${type}/${time}?language=en-US`,
      options
    )
    const data = await response.json()
    switch (time) {
      case 'day':
        switch (type) {
          case 'all':
            trendingLists.All.Today = data.results
            break
          case 'movie':
            trendingLists.Movies.Today = data.results
            break
          case 'person':
            trendingLists.People.Today = data.results
            break
          case 'tv':
            trendingLists.TV.Today = data.results
            break
        }
        break

      case 'week':
        switch (type) {
          case 'all':
            trendingLists.All['This Week'] = data.results
            break
          case 'movie':
            trendingLists.Movies['This Week'] = data.results
            break
          case 'person':
            trendingLists.People['This Week'] = data.results
            break
          case 'tv':
            trendingLists.TV['This Week'] = data.results
            break
        }
        break
    }
  }
  /**
   *
   * @param {type} type airing_today,on_the_air,popular,top_rated
   */
  async function getTVSeriesList(type) {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${type}?language=en-US&page=1`,
      options
    )
    const data = await response.json()

    switch (type) {
      case 'airing_today':
        TVSeriesLists['Airing Today'] = data.results
        break
      case 'on_the_air':
        TVSeriesLists['On TV'] = data.results
        break
      case 'popular':
        TVSeriesLists.Popular = data.results
        break
      case 'top_rated':
        TVSeriesLists['Top Rated'] = data.results
        break
    }
  }

  function getList(type) {
    switch (type) {
      case 'movieLists':
        getMovieLists()
        break
      case 'trendingLists':
        getTrendingLists()
        break
      case 'TVSeriesLists':
        getTVSeriesLists()
        break

      default:
        getMovieLists()
        getTrendingLists()
        getTVSeriesLists()
        break
    }
    function getMovieLists() {
      getMovieList('now_playing')
      getMovieList('popular')
      getMovieList('top_rated')
      getMovieList('upcoming')
    }
    function getTrendingLists() {
      getTrendingList('all', 'day')
      getTrendingList('all', 'week')
      getTrendingList('movie', 'day')
      getTrendingList('movie', 'week')
      getTrendingList('person', 'day')
      getTrendingList('person', 'week')
    }
    function getTVSeriesLists() {
      getTVSeriesList('airing_today')
      getTVSeriesList('on_the_air')
      getTVSeriesList('popular')
      getTVSeriesList('top_rated')
    }
  }

  async function getMovie(id) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=credits,keywords,external_ids,videos,recommendations`,
      options
    )

    const data = await response.json()
    movie.value = data
    movie.value.backdrop_path =
      'url(' + `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${data.backdrop_path}` + ')'
    let arr = new Array()
    let movieFilterArr = ['Director', 'Screenplay', 'Story', 'Writer', 'Novel']
    movie.value.credits.crew.map((item) =>
      movieFilterArr.forEach((filter) =>
        item.job === filter ? arr.push({ name: item.name, job: item.job }) : ''
      )
    )
    movie.value.color = getRandomColor()
    movie.value.reduced = CrewFilterByName(arr)
    movie.value.credits.crew = CrewFilterByDepartment(movie.value.credits.crew)
    let crewCount = 0
    for (const obj in movie.value.credits.crew) {
      crewCount = crewCount + movie.value.credits.crew[obj].length
      movie.value.credits.crew[obj] = CrewFilterByName(movie.value.credits.crew[obj])
    }
    movie.value.credits.crew = sortObjByKeys(movie.value.credits.crew)
    movie.value.crewCount = crewCount
    let languageFormat = new Intl.DisplayNames(['en'], { type: 'language' })
    let currencyFormatter = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' })
    movie.value.revenue !== 0
      ? (movie.value.revenue = currencyFormatter.format(movie.value.revenue))
      : (movie.value.revenue = '-')
    movie.value.budget !== 0
      ? (movie.value.budget = currencyFormatter.format(movie.value.budget))
      : (movie.value.budget = '-')
    movie.value.original_language = languageFormat.of(movie.value.original_language)
    movie.value.videos = movie.value.videos.results
    getMedia(id)
  }

  async function getMedia(id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/images`, options)
    const data = await response.json()
    data.backdrops = data.backdrops.sort(compareByVote)
    data.posters = data.posters.sort(compareByVote)

    movie.value.backdrops = data.backdrops

    movie.value.posters = data.posters
  }

  function imageURL(size, path) {
    const baseURL = 'https://image.tmdb.org/t/p/'
    return baseURL + size + path
  }

  return {
    resetStore,
    movieLists,
    getMovieList,
    trendingLists,
    getTrendingList,
    TVSeriesLists,
    getTVSeriesList,
    getList,
    movie,
    getMovie,
    getMedia,
    imageURL
  }
})
