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
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
    const data = await response.json()
    movie.value = data
    movie.value.backdrop_path =
      'url(' + `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${data.backdrop_path}` + ')'
  }

  return {
    movieLists,
    getMovieList,
    trendingLists,
    getTrendingList,
    TVSeriesLists,
    getTVSeriesList,
    getList,
    movie,
    getMovie
  }
})
